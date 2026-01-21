/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useMemo, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useAuth, useUser } from "@clerk/clerk-react"


export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { user } = useUser()
  const { getToken } = useAuth()

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: ""
  })

  const [isSearched, setIsSearched] = useState(false)
  const [jobs, setJobs] = useState([])
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

  const [companyToken, setCompanyToken] = useState(null)
  const [companyData, setCompanyData] = useState(null)

  const [userData, setUserData] = useState(null)
  const [userApplications, setUserApplications] = useState([])

  /* ===================== FETCH JOBS ===================== */
  const fetchJobs = async () => {
    if (!backendUrl) return
    try {
      const { data } = await axios.get(`${backendUrl}/api/job/jobs`)
      if (data.success) {
        setJobs(data.jobs)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  /* ===================== FETCH COMPANY DATA ===================== */
  const fetchCompanyData = async () => {
    if (!companyToken || !backendUrl) return
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/company/data`,
        { headers: { token: companyToken } }
      )

      if (data.success) {
        setCompanyData(data.company)
        localStorage.setItem("companyData", JSON.stringify(data.company))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  /* ===================== FETCH USER DATA ===================== */
  const fetchUserData = async () => {
    if (!user || !backendUrl) return
    try {
      const token = await getToken()
      if (!token) return

      const { data } = await axios.get(
        `${backendUrl}/api/users/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setUserData(data.user)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  /* ===================== FETCH USER APPLICATIONS ===================== */
  const fetchUserApplications = async () => {
    if (!user || !backendUrl) return
    try {
      const token = await getToken()
      if (!token) return

      const { data } = await axios.get(
        `${backendUrl}/api/users/applications`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setUserApplications(data.applications)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  /* ===================== INITIAL LOAD ===================== */
  useEffect(() => {
    fetchJobs()

    const storedCompanyToken = localStorage.getItem("companyToken")
    const storedCompanyData = localStorage.getItem("companyData")

    if (storedCompanyToken) setCompanyToken(storedCompanyToken)
    if (storedCompanyData) setCompanyData(JSON.parse(storedCompanyData))
  }, [])

  /* ===================== COMPANY TOKEN CHANGE ===================== */
  useEffect(() => {
    if (companyToken) {
      localStorage.setItem("companyToken", companyToken)
      fetchCompanyData()
    }
  }, [companyToken])

  /* ===================== USER CHANGE ===================== */
  useEffect(() => {
    if (user) {
      fetchUserData()
      fetchUserApplications()
    } else {
      setUserData(null)
      setUserApplications([])
    }
  }, [user])

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
      fetchUserApplications
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
      userApplications
    ]
  )

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
