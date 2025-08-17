
import { supabase,  } from '@/lib/supabase'
import {supabaseAdmin} from '@/lib/supabaseServer'

export default async function UsersPage() {
  // const { data: users, error } = await supabaseAdmin
  //   .from('users')
  //   .select('*')
  // console.log(users)
  // if (error) {
  //   console.error(error)
  //   return <p>Error loading users</p>
  // }

  const { count, error} = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true }) // head: true fetches only count

  if (error) {
    console.error("Error fetching user count:", error)
    return 0
  }
  console.log(count)
  return (
    <div>
      {/* <h1>Users</h1>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul> */}
    </div>
  )
}
