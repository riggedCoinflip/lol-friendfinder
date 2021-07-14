const isAuthenticated = (token) => {
     localStorage.getItem("SECREToken") ? true:false;
}