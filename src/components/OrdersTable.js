'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Box, Select, MenuItem, Typography
} from '@mui/material';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ordersRef = ref(db, process.env.NEXT_PUBLIC_FIREBASE_CLIENT_PATH);
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const orders = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })).reverse() : [];
      setOrders(orders);
      setLoading(false);
    }, (error) => {
      console.error('Firebase read failed:', error);
      setError('Failed to load orders');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post('/api/orders', { orderId, status: newStatus });
      
      if (response.data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        console.error("Update failed:", response.data.error);
      }
    } catch (error) {
      console.error("Failed to update order:", error.response?.data || error.message);
    }
  };

  if (error) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Customer</strong></TableCell>
            <TableCell><strong>Phone</strong></TableCell>
            <TableCell width="30%"><strong>Order Details</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Time</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => {

              const statusColors = {
                'Pending': '#f3b43f',
                'In-Progress': '#1E90FF',
                'Ready': '#2ad02a',
                'Completed': '#31901c',
                'Cancelled': '#ef4848'
              };
              const statusColor = statusColors[order.status] || '#000000';

              return (
                <TableRow key={order.id || order.timestamp}>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.customerNumber}</TableCell>
                  <TableCell>{order.orderDetails}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status || 'Pending'}
                      onChange={(e) => updateOrderStatus(order.id || order.timestamp, e.target.value)}
                      size="small"
                      sx={{
                        backgroundColor: statusColor,
                        color: 'black',
                        '& .MuiSelect-icon': { color: 'white' },
                        '&:hover': { backgroundColor: statusColor },
                        minWidth: 120
                      }}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In-Progress">In Progress</MenuItem>
                      <MenuItem value="Ready">Ready</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {order.timestamp ? 
                      new Date(order.timestamp).toLocaleString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) + ' - ' +
                      new Date(order.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      })
                      : "N/A"
                    }
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}