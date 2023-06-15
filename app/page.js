'use client' // nextjs create server side rendered react app by default, this tells it to create a client side rendered app
import React, {
  useState, useEffect
} from 'react'
import Image from 'next/image'
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore"; // import the firestore functions we need, addDoc is for adding a document to a collection, collection is for getting a collection. getDocs is for getting all the documents in a collection
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
        setItems([...items, { ...newItem }]) // add the newItem to the items array
        setNewItem({ name: '', price: '' })// reset newItem to empty strings
      } catch (e) {
        console.error("Error adding document: ", e);
      }

    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => { // onSnapshot is a listener that will run every time the items collection changes, snapshot is the data that is returned,
      const updatedItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // output: [{id: '123', name: 'coffee', price: 4.95}, {id: '456', name: 'tea', price: 3.95}]
      setItems(updatedItems);
    });

    return () => unsubscribe(); // this is the cleanup function, it will run when the component is unmounted
  }, []);

  // read items from database
  useEffect(() => {
    const getItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items")); // get all the documents in the items collection
      let tempItems = []; // create a temporary array to hold the items
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        tempItems.push(doc.data()); // add each item to the tempItems array
      });
      setItems(tempItems);
    }
    getItems(); // this is to call the function we just created, otherwise it will never run

  }, []) // the empty array as the second argument means this will only run once, when the component is mounted


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
              <button className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'>X</button>
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
