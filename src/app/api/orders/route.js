import { ref, onValue, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ordersRef = ref(db, process.env.FIREBASE_CLIENT_PATH);
    
    return new Promise((resolve) => {
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        const orders = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse() : [];
        
        resolve(NextResponse.json({ orders }));
      }, (error) => {
        console.error('Firebase read failed:', error);
        resolve(NextResponse.json(
          { error: 'Failed to load orders' },
          { status: 500 }
        ));
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing orderId or status' },
        { status: 400 }
      );
    }
    
    const orderRef = ref(db, `${process.env.FIREBASE_CLIENT_PATH}/${orderId}`);
    console.log(`Updating order ${orderId} to status ${status}`);
    
    await update(orderRef, { status });
    
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