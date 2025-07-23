import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const Protected2Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state?.result || []) as User[];
  const user = result[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome back, {user?.name || "User"}!</h1>
        <p className="mb-6">You have successfully logged in using the blacklist-protected route. Here is your information:</p>
        <div className="overflow-x-auto mb-6 w-full">
          <table className="min-w-full border border-gray-300 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Password</th>
              </tr>
            </thead>
            <tbody>
              {result.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 border">{u.name}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border">{u.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="secondary" className="w-full" onClick={() => navigate("/")}>Logout</Button>
      </div>
    </div>
  );
};

export default Protected2Success; 