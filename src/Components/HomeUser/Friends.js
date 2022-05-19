import React from 'react'

//components
import Dashboard from './Dashboard'

function Friends({ friend, user }) {
  const expenses = user.expenses

  //! Ver con q mas completo los datos en friends.
  console.log(expenses)

  let expensesToShow = []

  expensesToShow = expenses.filter((expense) => {
    const users = [...expense.paidBy, ...expense.debtors]
    const usernames = users.map((user) => user.username)
    console.log(usernames)
    return usernames.includes(friend)
  })

  console.log(expensesToShow)
  //? Sacar los expenses, revisar en q expense esta el usuario actual y el usuario especifico que visite y asi poner los expenses q comparte con el.

  return (
    <Dashboard user={user} friend={friend} filterByFriend={expensesToShow} />
  )
}

export default Friends
