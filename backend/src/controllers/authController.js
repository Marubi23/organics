const { collections, auth, getTimestamp } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Password hashing helper
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare password helper
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (userId, userType) => {
    return jwt.sign(
        { userId, userType },
        process.env.JWT_SECRET || 'mzuri-organics-secret-key-change-in-production',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

class AuthController {
    // User Registration
    async signup(req, res) {
        try {
            console.log('📝 Signup request received:', req.body);
            
            const {
                fullName,
                phoneNumber,
                email,
                userType,
                password,
                county,
                subCounty,
                ward,
                village,
                nearestTown,
                landmark,
                farmSize,
                mainCrops,
                livestock,
                farmingExperience,
                agreeTerms
            } = req.body;

            // Validation
            if (!fullName || !phoneNumber || !password || !userType || !county || !subCounty || !ward || !nearestTown) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields',
                    missingFields: {
                        fullName: !fullName,
                        phoneNumber: !phoneNumber,
                        password: !password,
                        userType: !userType,
                        county: !county,
                        subCounty: !subCounty,
                        ward: !ward,
                        nearestTown: !nearestTown
                    }
                });
            }

            if (!agreeTerms) {
                return res.status(400).json({
                    success: false,
                    message: 'You must agree to the terms and conditions'
                });
            }

            // Clean phone number
            const cleanPhone = phoneNumber.replace(/\D/g, '');
            if (cleanPhone.length !== 9) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number must be 9 digits (without country code)'
                });
            }

            // Check if user already exists by phone
            const existingUser = await collections.users
                .where('phoneNumber', '==', cleanPhone)
                .limit(1)
                .get();

            if (!existingUser.empty) {
                return res.status(409).json({
                    success: false,
                    message: 'Phone number is already registered. Please login instead.'
                });
            }

            // Hash password
            const hashedPassword = await hashPassword(password);
            console.log('✅ Password hashed successfully');

            // Create user object
            const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const timestamp = getTimestamp();
            
            // Default points based on user type
            let points = 50;
            if (userType === 'farmer') points = 100;
            if (userType === 'agronomist') points = 150;
            
            const userData = {
                userId,
                phoneNumber: cleanPhone,
                fullName: fullName.trim(),
                email: email?.trim() || '',
                userType,
                password: hashedPassword,
                county,
                subCounty: subCounty.trim(),
                ward: ward.trim(),
                village: village?.trim() || '',
                nearestTown: nearestTown.trim(),
                landmark: landmark?.trim() || '',
                farmSize: farmSize ? parseFloat(farmSize) : 0,
                mainCrops: mainCrops || [],
                livestock: livestock || [],
                farmingExperience: farmingExperience || '',
                isVerified: false,
                isActive: true,
                points: points,
                tier: 'Bronze',
                createdAt: timestamp,
                updatedAt: timestamp,
                lastLogin: timestamp
            };

            console.log('👤 Creating user in Firestore...');

            // Store user in Firestore
            await collections.users.doc(userId).set(userData);
            console.log('✅ User stored in Firestore');

            // Create Firebase Auth user (optional)
            try {
                const firebaseUser = await auth.createUser({
                    uid: userId,
                    phoneNumber: `+254${cleanPhone}`,
                    displayName: fullName,
                    email: email || undefined,
                    disabled: false
                });

                // Set custom claims for user type
                await auth.setCustomUserClaims(firebaseUser.uid, {
                    userType: userType,
                    tier: 'Bronze'
                });

                // Add Firebase UID to user data
                userData.firebaseUid = firebaseUser.uid;
                await collections.users.doc(userId).update({ firebaseUid: firebaseUser.uid });
                
                console.log('✅ Firebase Auth user created');
            } catch (firebaseError) {
                console.warn('⚠️ Firebase Auth creation skipped:', firebaseError.message);
                // Continue without Firebase Auth
            }

            // Generate token
            const token = generateToken(userId, userType);
            console.log('✅ JWT token generated');

            // Remove password from response
            const userResponse = { ...userData };
            delete userResponse.password;

            // Create welcome notification
            const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const notificationData = {
                notificationId,
                userId,
                title: 'Welcome to Mzuri Organics! 🎉',
                message: `Welcome ${fullName}! Thank you for joining our community. You've received ${points} bonus points.`,
                type: 'welcome',
                isRead: false,
                createdAt: timestamp
            };

            await collections.notifications.doc(notificationId).set(notificationData);
            console.log('✅ Welcome notification created');

            // Log the signup in analytics
            const analyticsId = `analytics_${Date.now()}`;
            const analyticsData = {
                analyticsId,
                event: 'user_signup',
                userId,
                userType,
                county,
                timestamp
            };
            
            await collections.analytics.doc(analyticsId).set(analyticsData);

            res.status(201).json({
                success: true,
                message: 'Account created successfully! Welcome to Mzuri Organics.',
                data: {
                    token,
                    user: userResponse,
                    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
                },
                timestamp: new Date().toISOString()
            });

            console.log('🎉 Signup completed successfully');

        } catch (error) {
            console.error('❌ Signup error:', error);
            res.status(500).json({
                success: false,
                message: 'Registration failed. Please try again.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // User Login
    async login(req, res) {
        try {
            console.log('🔐 Login request received');
            
            const { phoneNumber, password, rememberMe = false } = req.body;

            if (!phoneNumber || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number and password are required'
                });
            }

            // Clean phone number
            const cleanPhone = phoneNumber.replace(/\D/g, '');
            
            // Find user by phone number
            const userQuery = await collections.users
                .where('phoneNumber', '==', cleanPhone)
                .where('isActive', '==', true)
                .limit(1)
                .get();

            if (userQuery.empty) {
                console.log('❌ User not found with phone:', cleanPhone);
                return res.status(401).json({
                    success: false,
                    message: 'Invalid phone number or password'
                });
            }

            const userDoc = userQuery.docs[0];
            const userData = userDoc.data();

            console.log('👤 User found:', userData.userId);

            // Verify password
            const isPasswordValid = await comparePassword(password, userData.password);
            if (!isPasswordValid) {
                console.log('❌ Invalid password for user:', userData.userId);
                return res.status(401).json({
                    success: false,
                    message: 'Invalid phone number or password'
                });
            }

            console.log('✅ Password verified');

            // Generate token
            const token = generateToken(userData.userId, userData.userType);

            // Update last login
            const timestamp = getTimestamp();
            await collections.users.doc(userData.userId).update({
                lastLogin: timestamp,
                updatedAt: timestamp
            });

            // Remove password from response
            const userResponse = { ...userData };
            delete userResponse.password;

            // Create login session record
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const sessionData = {
                sessionId,
                userId: userData.userId,
                userType: userData.userType,
                loginTime: timestamp,
                rememberMe,
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip
            };

            await collections.sessions.doc(sessionId).set(sessionData);

            // Set token expiration based on rememberMe
            const tokenExpiry = rememberMe ? '7d' : '1d';

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: userResponse,
                    expiresIn: tokenExpiry,
                    sessionId
                },
                timestamp: new Date().toISOString()
            });

            console.log('✅ Login successful for user:', userData.userId);

        } catch (error) {
            console.error('❌ Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Login failed. Please try again.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get User Profile
    async profile(req, res) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const userDoc = await collections.users.doc(userId).get();

            if (!userDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const userData = userDoc.data();
            
            // Remove sensitive data
            delete userData.password;
            
            // Calculate additional stats for farmers
            if (userData.userType === 'farmer') {
                // Get farmer's products count
                const productsQuery = await collections.products
                    .where('farmerId', '==', userId)
                    .where('isActive', '==', true)
                    .get();
                
                userData.productCount = productsQuery.size;
                
                // Get farmer's orders count
                const ordersQuery = await collections.orders
                    .where('farmerId', '==', userId)
                    .get();
                
                userData.orderCount = ordersQuery.size;
                
                // Calculate total sales
                let totalSales = 0;
                ordersQuery.forEach(doc => {
                    const order = doc.data();
                    if (order.totalAmount) {
                        totalSales += parseFloat(order.totalAmount);
                    }
                });
                userData.totalSales = totalSales;
            }

            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: userData,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve profile',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Update Profile
    async updateProfile(req, res) {
        try {
            const userId = req.user?.userId;
            const updateData = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Remove fields that shouldn't be updated
            delete updateData.userId;
            delete updateData.phoneNumber;
            delete updateData.password;
            delete updateData.createdAt;
            delete updateData.firebaseUid;

            // Add updated timestamp
            updateData.updatedAt = getTimestamp();

            await collections.users.doc(userId).update(updateData);

            // Get updated user
            const updatedUserDoc = await collections.users.doc(userId).get();
            const updatedUser = updatedUserDoc.data();
            delete updatedUser.password;

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Logout
    async logout(req, res) {
        try {
            const userId = req.user?.userId;
            const { sessionId } = req.body;

            if (sessionId) {
                // Mark session as ended
                await collections.sessions.doc(sessionId).update({
                    logoutTime: getTimestamp(),
                    isActive: false
                });
            }

            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Logout failed',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Check phone availability
    async checkPhone(req, res) {
        try {
            const { phoneNumber } = req.query;
            
            if (!phoneNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number is required'
                });
            }

            const cleanPhone = phoneNumber.replace(/\D/g, '');
            
            const userQuery = await collections.users
                .where('phoneNumber', '==', cleanPhone)
                .limit(1)
                .get();

            res.status(200).json({
                success: true,
                data: {
                    isAvailable: userQuery.empty,
                    phoneNumber: cleanPhone
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Check phone error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to check phone availability',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Forgot password (send reset code)
    async forgotPassword(req, res) {
        try {
            const { phoneNumber } = req.body;
            
            if (!phoneNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number is required'
                });
            }

            const cleanPhone = phoneNumber.replace(/\D/g, '');
            
            // Check if user exists
            const userQuery = await collections.users
                .where('phoneNumber', '==', cleanPhone)
                .where('isActive', '==', true)
                .limit(1)
                .get();

            if (userQuery.empty) {
                return res.status(404).json({
                    success: false,
                    message: 'No account found with this phone number'
                });
            }

            // Generate reset code (6 digits)
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

            // Store reset code
            const resetId = `reset_${Date.now()}`;
            await collections.sessions.doc(resetId).set({
                resetId,
                userId: userQuery.docs[0].id,
                phoneNumber: cleanPhone,
                resetCode,
                expiresAt,
                isUsed: false,
                createdAt: getTimestamp()
            });

            // TODO: Send SMS with reset code (integrate with SMS service)
            console.log(`Reset code for ${cleanPhone}: ${resetCode}`);

            res.status(200).json({
                success: true,
                message: 'Reset code sent to your phone',
                data: {
                    phoneNumber: cleanPhone,
                    // In development, return the code for testing
                    resetCode: process.env.NODE_ENV === 'development' ? resetCode : undefined
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Forgot password error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process request',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

// Export the class directly (not an instance)
module.exports = AuthController;