'use client' // nextjs create server side rendered react app by default, this tells it to create a client side rendered app
import React, {
  useState, useEffect
} from 'react'
import Image from 'next/image'

export default function Home() {
  const [item, setItems] = useState([
    { name: 'coffee', price: 4.95 },
    { name: 'tea', price: 3.95 },
    { name: 'scone', price: 2.95 },
  ]);
  const [total, setTotal] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center sm:p-24 p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className='text-4xl p-4 text-center'>Expense Tracker</h1>
      </div>
      <div className='bg-slate-800 p-4 rounded-lg'>
        <form className='grid grid-cols-6 items-center text-black'>
          <input className='col-span-3 p-3 border' type='text' placeholder='Enter Item' />
          <input className='col-span-2 p-3 border mx-3' type='number' placeholder='Enter $' />
          <button className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl' type='submit'>+</button>
        </form>

        <ul>
          {item.map((item, index) => (
            <li key={index} className='flex justify-between my-4 w-full text-white bg-slate-950'>
              <div className='p-4 w-full flex justify-between'>
                <span className='capitalize'>{item.name}</span>
                <span>${item.price}</span>
              </div>
              <button className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'>X</button>
            </li>
          ))}
        </ul>
      </div >
    </main >
  )
}
