import { ref, update, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing orderId or status' },
        { status: 400 }
      );
    }
    
    const orderRef = ref(db, `${process.env.NEXT_PUBLIC_FIREBASE_CLIENT_PATH}/${orderId}`);
    console.log(`Updating order ${orderId} to status ${status}`);

    const snapshot = await get(orderRef);
    const orderData = snapshot.val();

    await update(orderRef, { status });

    try {
      await axios.post(process.env.ZAPIER_UPDATE_WEBHOOK_URL, {
        orderId,
        newStatus: status,
        previousStatus: orderData.status,
        customerName: orderData.customerName,
        phone: orderData.customerNumber,
        timestamp: Date.now()
      });
    } catch (webhookError) {
      console.error('Webhook failed:', webhookError);
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Detailed Error:', error.message, error.stack);
    return NextResponse.json(
      { error: `Failed to update order status: ${error.message}` },
      { status: 500 }
    );
  }
}