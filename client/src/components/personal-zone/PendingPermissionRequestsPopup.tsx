// src/components/PermissionRequestsPopup.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useApprovePermission, useFilteredUserRequests } from '../../hooks/usePermissions';
import {PermissionRequestFromServer } from '../../types';

interface PermissionRequestsPopupProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  username: string;
}

const PermissionRequestsPopup: React.FC<PermissionRequestsPopupProps> = ({
  open,
  onClose,
  userId,
  username,
}) => {
  const userPendingRequest = useFilteredUserRequests(userId);
  console.log("userPendingRequest: " ,userPendingRequest); 
    
    const approveMutation = useApprovePermission();


  const formatPermissions = (requestedPermissions: PermissionRequestFromServer['requestedPermissions']) => {
    const perms: string[] = [];
    if (requestedPermissions.canAdd) perms.push('Add');
    if (requestedPermissions.canUpdate) perms.push('Update');
    if (requestedPermissions.canDelete) perms.push('Delete');
    return perms.join(', ') || 'None';
  };

  const handleApprove = (requestId: string, requestedPermissions: PermissionRequestFromServer['requestedPermissions']) => {
    approveMutation.mutate(
      {
        id: requestId,
        approvals: requestedPermissions, 
      },
      {
        onSuccess: () => {
          console.log('✔️ Approved request:', requestId);
        },
        onError: (error) => {
          console.error('❌ Error approving permission request:', error);
        },
      }
    );
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Pending Permission Requests for {username}</DialogTitle>
      <DialogContent>
      {userPendingRequest.length === 0 && (
            <DialogContentText>No permission requests found for this user.</DialogContentText>
          )}
        {userPendingRequest.length > 0 && (
          <DialogContentText>
            No permission requests found for this user.
          </DialogContentText>
        )}
        {userPendingRequest && userPendingRequest.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Requested Permissions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userPendingRequest.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{formatPermissions(request.requestedPermissions)}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleApprove(request._id || "unde", request.requestedPermissions)}
                        disabled={approveMutation.isPending}
                      >
                        {approveMutation.isPending ? "Approving..." : "Approve"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionRequestsPopup;
