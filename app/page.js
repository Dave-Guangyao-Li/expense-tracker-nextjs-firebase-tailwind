'use client' // nextjs create server side rendered react app by default, this tells it to create a client side rendered app
import React, {
  useState, useEffect
} from 'react'
import Image from 'next/image'
import { collection, addDoc, getDocs, onSnapshot, doc, deleteDoc, query } from "firebase/firestore"; // import the firestore functions we need, addDoc is for adding a document to a collection, collection is for getting a collection. getDocs is for getting all the documents in a collection
import { db } from './firebase' // import the db object we created in firebase.js

export default function Home() {
  const [items, setItems] = useState([
    // { name: 'coffee', price: 4.95 },
    // { name: 'tea', price: 3.95 },
    // { name: 'scone', price: 2.95 },
  ]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });// this is the item we are adding to the database
  const [total, setTotal] = useState(0);

  // add item to database
  const addItem = async (e) => {
    e.preventDefault();// prevent page from refreshing, which is the default behavior of a form submission
    if (newItem.name !== "" && newItem.price !== "") {

      // add to database
      try {
        const docRef = await addDoc(collection(db, "items"), {
          name: newItem.name.trim(),
          price: newItem.price,
        });
        console.log("Document written with ID: ", docRef.id);
        // set items with unique id
        setNewItem({ name: '', price: '' })// reset newItem to empty strings
      } catch (e) {
        console.error("Error adding document: ", e);
      }

    }
  }


  // Read items from database
  useEffect(() => {
    const q = query(collection(db, 'items')); // create a query to get all the documents in the items collection
    const unsubscribe = onSnapshot(q, (querySnapshot) => { // onSnapshot will run every time the items collection changes, and it will give us a snapshot of the items collection
      let itemsArr = [];

      querySnapshot.forEach((doc) => { // loop through the snapshot and push each document into the itemsArr
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr); // set the items state to the itemsArr

      // Read total from itemsArr
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);



  // calculate total, this will run every time the items array changes
  useEffect(() => {
    // calculate total, this is a separate useEffect because we only want to run it when items changes, not when the component is mounted
    const calculateTotal = () => {
      const totalPrice = items.reduce((total, item) => total + Number(item.price), 0);
      setTotal(totalPrice);
    }
    calculateTotal();
    console.log('items changed, calculating total')
  }, [items])

  // delete item from database
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id)); // delete the document with the id that was passed in
      console.log('item deleted')
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center sm:p-24 p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className='text-4xl p-4 text-center'>Expense Tracker</h1>
      </div>
      <div className='bg-slate-800 p-4 rounded-lg'>
        <form className='grid grid-cols-6 items-center text-black'>
          <input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className='col-span-3 p-3 border'
            type='text'
            placeholder='Enter Item'
          />
          <input
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className='col-span-2 p-3 border mx-3'
            type='number'
            placeholder='Enter $'
          />
          <button
            onClick={addItem} // when the button is clicked, call the addItem function
            className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl' type='submit'>+</button>
        </form>

        <ul>
          {items.map((item, index) => (
            <li key={index} className='flex justify-between my-4 w-full text-white bg-slate-950'>
              <div className='p-4 w-full flex justify-between'>
                <span className='capitalize'>{item.name}</span>
                <span>${item.price}</span>
              </div>
              <button
                onClick={() => deleteItem(item.id)} // target the deleteItem function and pass in the id of the item we want to delete
                className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'>X</button>
            </li>
          ))}
          {items.length < 1 ? (
            <div className='flex justify-between p-3 text-white'>
              <span>No Items</span>
            </div>) : (
            <div className='flex justify-between p-3 text-white'>
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </ul>
      </div >
    </main >
  )
}
