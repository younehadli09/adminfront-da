import axios from 'axios';

export const getTotalSales = async () => {
    // await connectToDB();
    // const orders = await Order.find()
    // const totalOrders = orders.length;
    // const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)
    // return { totalOrders, totalRevenue }
}

export const getTotalCustomers = async () => {
    try{
    const token = localStorage.getItem('authtoken'); // Retrieve token from local storage

    const response = await axios.get(process.env.NEXT_PUBLIC_IPHOST+'/StoreAPI/users/countusers',{
        headers: {
            'Content-Type': 'multipart/form-data',  // Use 'multipart/form-data' for FormData
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data.count;
}catch(error){
    console.log(error);
    return 0;
}
}
export const getTotalorders = async ()=>{
    try{
        const token = localStorage.getItem('authtoken'); // Retrieve token from local storage
    
        const response = await axios.get(process.env.NEXT_PUBLIC_IPHOST+'/StoreAPI/orders/countorders',{
            headers: {
                'Content-Type': 'multipart/form-data',  // Use 'multipart/form-data' for FormData
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(response.data.count.toString())
        return response.data.count;
    }catch(error){
        console.log(error);
        return 0;
    }
}
export const getSalesPerMonth = async () => {
    // await connectToDB()
    // const orders = await Order.find()

    // const salesPerMonth = orders.reduce((acc, order) => {
    //     const monthIndex = new Date(order.createdAt).getMonth(); // 0 for Janruary --> 11 for December
    //     acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
    //     // For June
    //     // acc[5] = (acc[5] || 0) + order.totalAmount (orders have monthIndex 5)
    //     return acc
    // }, {})

    // const graphData = Array.from({ length: 12 }, (_, i) => {
    //     const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i))
    //     // if i === 5 => month = "Jun"
    //     return { name: month, sales: salesPerMonth[i] || 0 }
    // })

    // return graphData
}