const adminMiddleware = async (req, res, next) => {
    try {
        console.log('Admin middleware - User:', req.user);
        
        if (!req.user) {
            console.log('Admin middleware - No user found in request');
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (req.user.role !== 'admin') {
            console.log('Admin middleware - User is not an admin:', req.user.role);
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        console.log('Admin middleware - Access granted for admin user');
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = adminMiddleware;
  