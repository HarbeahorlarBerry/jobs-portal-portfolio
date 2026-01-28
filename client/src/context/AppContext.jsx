/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  /* ===================== JOB SEARCH ===================== */
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);

  /* ===================== UI ===================== */
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  /* ===================== COMPANY AUTH ===================== */
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  /* ===================== USER DATA ===================== */
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  /* ===================== FETCH JOBS ===================== */
  const fetchJobs = async () => {
    if (!backendUrl) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/job/jobs`);
      if (data.success) setJobs(data.jobs);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  /* ===================== FETCH COMPANY DATA ===================== */
  const fetchCompanyData = async () => {
    if (!companyToken || !backendUrl) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/data`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setCompanyData(data.company);
        localStorage.setItem("companyData", JSON.stringify(data.company));
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  /* ===================== FETCH USER DATA ===================== */
  const fetchUserData = async () => {
    if (!isLoaded || !user || !backendUrl) return;

    try {
      const token = await getToken({ template: "session" });
      if (!token) return;

      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Fetch user data error:", error);
      setUserData(null);
    }
  };

  /* ===================== FETCH USER APPLICATIONS ===================== */
  const fetchUserApplications = async () => {
    if (!isLoaded || !user || !backendUrl) return;

    try {
      const token = await getToken({ template: "session" });
      if (!token) return;

      const { data } = await axios.get(
        `${backendUrl}/api/users/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setUserApplications(data.applications);
      } else {
        setUserApplications([]);
      }
    } catch (error) {
      console.error("Fetch user applications error:", error);
      setUserApplications([]);
    }
  };

  /* ===================== INITIAL LOAD ===================== */
  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");
    const storedCompanyData = localStorage.getItem("companyData");

    if (storedCompanyToken) setCompanyToken(storedCompanyToken);
    if (storedCompanyData) setCompanyData(JSON.parse(storedCompanyData));
  }, []);

  /* ===================== COMPANY TOKEN CHANGE ===================== */
  useEffect(() => {
    if (companyToken) {
      localStorage.setItem("companyToken", companyToken);
      fetchCompanyData();
    } else {
      localStorage.removeItem("companyToken");
      localStorage.removeItem("companyData");
      setCompanyData(null);
    }
  }, [companyToken]);

  /* ===================== USER CHANGE ===================== */
  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      fetchUserData();
      fetchUserApplications();
    } else {
      setUserData(null);
      setUserApplications([]);
    }
  }, [user, isLoaded]);

  /* ===================== CONTEXT VALUE ===================== */
  const value = useMemo(
    () => ({
      searchFilter,
      setSearchFilter,
      isSearched,
      setIsSearched,
      jobs,
      setJobs,
      showRecruiterLogin,
      setShowRecruiterLogin,
      companyToken,
      setCompanyToken,
      companyData,
      setCompanyData,
      backendUrl,
      userData,
      userApplications,
      fetchUserData,
      fetchUserApplications,
    }),
    [
      searchFilter,
      isSearched,
      jobs,
      showRecruiterLogin,
      companyToken,
      companyData,
      backendUrl,
      userData,
      userApplications,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};



// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-refresh/only-export-components */
// import { createContext, useState, useMemo, useEffect } from "react"
// import axios from "axios"
// import { toast } from "react-toastify"
// import { useAuth, useUser } from "@clerk/clerk-react"


// export const AppContext = createContext()

// export const AppContextProvider = ({ children }) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL

//   const { user } = useUser()
//   const { getToken } = useAuth()

//   const [searchFilter, setSearchFilter] = useState({
//     title: "",
//     location: ""
//   })

//   const [isSearched, setIsSearched] = useState(false)
//   const [jobs, setJobs] = useState([])
//   const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

//   const [companyToken, setCompanyToken] = useState(null)
//   const [companyData, setCompanyData] = useState(null)

//   const [userData, setUserData] = useState(null)
//   const [userApplications, setUserApplications] = useState([])

//   /* ===================== FETCH JOBS ===================== */
//   const fetchJobs = async () => {
//     if (!backendUrl) return
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/job/jobs`)
//       if (data.success) {
//         setJobs(data.jobs)
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message)
//     }
//   }

//   /* ===================== FETCH COMPANY DATA ===================== */
//   const fetchCompanyData = async () => {
//     if (!companyToken || !backendUrl) return
//     try {
//       const { data } = await axios.get(
//         `${backendUrl}/api/company/data`,
//         { headers: { token: companyToken } }
//       )

//       if (data.success) {
//         setCompanyData(data.company)
//         localStorage.setItem("companyData", JSON.stringify(data.company))
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message)
//     }
//   }

// /* ===================== FETCH USER DATA ===================== */
// const fetchUserData = async (retryCount = 0) => {
//   if (!user || !backendUrl) return;

//   try {
//     // Wait for Clerk userId to be available
//     if (!user.id) {
//       // Retry a few times in case Clerk is still loading
//       if (retryCount < 5) {
//         setTimeout(() => fetchUserData(retryCount + 1), 300);
//       }
//       return;
//     }

//     // ✅ Get a Clerk session token
//     const token = await getToken({ template: "session" });
//     if (!token) throw new Error("No auth token found");

//     console.log("Clerk session token:", token); // Debug

//     const { data } = await axios.get(`${backendUrl}/api/users/user`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (data.success) {
//       setUserData(data.user);
//     } else {
//       toast.error(data.message || "Failed to fetch user data");
//     }
//   } catch (error) {
//     console.error("Fetch user data error:", error);

//     // Retry if Clerk hasn't initialized fully
//     if (retryCount < 5) {
//       setTimeout(() => fetchUserData(retryCount + 1), 500);
//     } else {
//       toast.error(error.response?.data?.message || error.message || "Unexpected error");
//     }
//   }
// };





//   /* ===================== FETCH USER APPLICATIONS ===================== */
//   const fetchUserApplications = async () => {
//     if (!user || !backendUrl) return
//     try {
//       const token = await getToken()
//       if (!token) return

//       const { data } = await axios.get(
//         `${backendUrl}/api/users/applications`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )

//       if (data.success) {
//         setUserApplications(data.applications)
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message)
//     }
//   }

//   /* ===================== INITIAL LOAD ===================== */
//   useEffect(() => {
//     fetchJobs()

//     const storedCompanyToken = localStorage.getItem("companyToken")
//     const storedCompanyData = localStorage.getItem("companyData")

//     if (storedCompanyToken) setCompanyToken(storedCompanyToken)
//     if (storedCompanyData) setCompanyData(JSON.parse(storedCompanyData))
//   }, [])

//   /* ===================== COMPANY TOKEN CHANGE ===================== */
//   useEffect(() => {
//     if (companyToken) {
//       localStorage.setItem("companyToken", companyToken)
//       fetchCompanyData()
//     }
//   }, [companyToken])

//   /* ===================== USER CHANGE ===================== */
//   useEffect(() => {
//     if (user) {
//       fetchUserData()
//       fetchUserApplications()
//     } else {
//       setUserData(null)
//       setUserApplications([])
//     }
//   }, [user])

//   /* ===================== CONTEXT VALUE ===================== */
//   const value = useMemo(
//     () => ({
//       searchFilter,
//       setSearchFilter,
//       isSearched,
//       setIsSearched,
//       jobs,
//       setJobs,
//       showRecruiterLogin,
//       setShowRecruiterLogin,
//       companyToken,
//       setCompanyToken,
//       companyData,
//       setCompanyData,
//       backendUrl,
//       userData,
//       userApplications,
//       fetchUserData,
//       fetchUserApplications
//     }),
//     [
//       searchFilter,
//       isSearched,
//       jobs,
//       showRecruiterLogin,
//       companyToken,
//       companyData,
//       backendUrl,
//       userData,
//       userApplications
//     ]
//   )

//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   )
// }
