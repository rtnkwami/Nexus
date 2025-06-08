import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const UserProfile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
  const getUserMetadata = async () => {
    const domain = import.meta.env.VITE_AUTH0_AUDIENCE;

    try {
    
      const accessToken = await getAccessTokenSilently({ //from Auth0 API
        authorizationParams: {
          audience: domain,
        },
      });

      const metadataResponse = await fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "user": {
              "sub": user.sub,
              "name": user.name
            }
          })
      });

      const serverResponse = await metadataResponse.json();
      console.log(serverResponse);
      
    } catch (e) {
      console.log(e.message);
    }
  };

    if (isAuthenticated) {
        getUserMetadata(); // Add this line
    }
}, [getAccessTokenSilently, isAuthenticated]);

  console.log(user);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default UserProfile;