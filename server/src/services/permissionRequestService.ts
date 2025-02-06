import mongoose, { ObjectId } from 'mongoose';
import PermissionRequest from '../models/PermissionRequest';
import User from '../models/User';

export const requestPermission = async (userId: string, permissions: { canAdd: boolean; canUpdate: boolean; canDelete: boolean }) => {
    return await PermissionRequest.create({
        user: userId,
        requestedPermissions: permissions,
        status: 'pending'
    });
};

export const getPendingRequests = async () => {
    return await PermissionRequest.find({ status: 'pending' }).populate('user', 'username email');
};

export const getRequestById = async (requestId: string) => {
    return await PermissionRequest.findById(requestId).populate('user', 'username email');
};

export const setUserPermissions = async (userId: string, permissions: { canAdd: boolean; canUpdate: boolean; canDelete: boolean }) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { permissions },
            { new: true, runValidators: true }
        );
        return updatedUser;
    } catch (error) {
        console.error('Error updating user permissions:', error);
        throw new Error('Failed to update user permissions');
    }
};

export const approvePermissionRequest = async (requestId: string, adminId: string, approvals: { canAdd?: boolean; canUpdate?: boolean; canDelete?: boolean }) => {
    const request = await PermissionRequest.findById(requestId);
    if (!request) throw new Error('Request not found');

    await setUserPermissions(request.user.toString(), {
        canAdd: approvals.canAdd || false,
        canUpdate: approvals.canUpdate || false,
        canDelete: approvals.canDelete || false
    });

    request.status = 'approved';
    request.reviewedBy = new mongoose.Types.ObjectId(adminId);
    return await request.save();
};

export const denyPermissionRequest = async (requestId: string, adminId: string) => {
    return await PermissionRequest.findByIdAndUpdate(
        requestId,
        { status: 'denied', reviewedBy: adminId },
        { new: true }
    );
};

export const getUserPermissionRequests = async (userId: string | mongoose.Types.ObjectId) => {
   const users= await PermissionRequest.find({ user: userId})
   .populate('reviewedBy', 'firstName lastName') 
    .sort({ createdAt: -1 }); 
   return users;  
};