import AdminOrderDetails from '@/components/admin-view/OrderDetails'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAdminOrderDetails, getALlUserOrderList, resetOrderDetails } from '@/store/admin/order-slice'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { orderList, orderDetails} = useSelector((state)=> state.adminOrder)
  const [openDetailsDialogue, setOpendDetailsDilogue] = useState(false)
  useEffect(()=>{
    dispatch(getALlUserOrderList())
  },[dispatch]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpendDetailsDilogue(true);
    }
  }, [orderDetails]);
  function handleAdminOrderDetails(id){
    dispatch(getAdminOrderDetails(id))
  }
  console.log(orderList)

  console.log("adminOrder Details" , orderDetails)
  return (
    <Card>
    <CardHeader> <CardTitle>All Orders</CardTitle></CardHeader>
    <CardContent>
    <Table>
    <TableCaption>A list of your Order History.</TableCaption>
        <TableHeader>
            <TableRow>    
            <TableHead>Order Id</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Ticket Price </TableHead>
            <TableHead>Payment Status  </TableHead>
            <TableHead>
                <span className='sr-only'> Details</span>
            </TableHead>
           
            </TableRow>
        </TableHeader>
        <TableBody>
        {orderList && orderList?.length > 0 ? 
        orderList?.map((item)=>
          <TableRow key={item._id}>
                <TableCell>{item._id} </TableCell>
                <TableCell>{item.paymentDate.split('T')[0] }</TableCell>
                <TableCell>
                <Badge className={`py-1 px-3 ${item?.eventStatus ==='confirmed' ? 'bg-green-500': 
                item?.eventStatus ==="rejected" ? 'bg-red-500' :
                'bg-black'}`} >
            <p>{item?.eventStatus}</p>
            </Badge>
                </TableCell>
                <TableCell>${item.totalAmount}</TableCell>
                <TableCell>
                <Badge className={`py-1 px-3 ${item?.paymentStatus ==='paid' ? 'bg-blue-400': 'bg-black'}`} >
            <p>{item?.paymentStatus}</p>
            </Badge>
                </TableCell>
                <TableCell>
                <Dialog
            
                open={openDetailsDialogue}
                onOpenChange={()=>{
                  setOpendDetailsDilogue(false);
              dispatch(resetOrderDetails())
                }}
                >
                <Button onClick ={()=> handleAdminOrderDetails(item?._id)}>View Details</Button>
                <AdminOrderDetails orderDetails={orderDetails}  />
                     </Dialog>
                </TableCell>
            </TableRow>
        )
        : null}
        </TableBody>
    </Table>
    </CardContent>
    </Card>
  )
}
