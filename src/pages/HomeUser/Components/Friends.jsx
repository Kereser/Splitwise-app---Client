import React from 'react'

//components
import Dashboard from './Dashboard'

function Friends({ friend, user }) {
  const expenses = user.expenses

  let expensesToShow = []
  expensesToShow = expenses.filter((expense) => {
    const users = [...expense.paidBy, ...expense.debtors]
    const usernames = users.map((user) => user.username)
    return usernames.includes(friend)
  })

  return (
    <Dashboard user={user} friend={friend} filterByFriend={expensesToShow} />
  )
}

export default Friends
