import React, { useRef, useState, useEffect, useContext } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { JobCategories, JobLocations } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const AddJobs = () => {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('Bangalore')
  const [category, setCategory] = useState('Programming')
  const [level, setLevel] = useState('Beginner level')
  const [salary, setSalary] = useState('')

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const { backendUrl, companyToken } = useContext(AppContext)

  // Submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const description = quillRef.current?.root.innerHTML || ''

      if (description === '<p><br></p>' || !description) {
        toast.error('Job description is required')
        return
      }

      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        {
          title,
          description,
          category,
          location,
          level,
          salary
        },
        {
          headers: {
            token: companyToken
          }
        }
      )

      if (data.success) {
        toast.success(data.message)
        setTitle('')
        setSalary('')
        quillRef.current.root.innerHTML = ''
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // Initialize Quill
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ size: [] }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
          ]
        }
      })
    }

    return () => {
      quillRef.current = null
    }
  }, [])

  return (
    <form
      onSubmit={onSubmitHandler}
      className="container p-4 flex flex-col w-full items-start gap-2"
    >
      {/* Job Title */}
      <div className="w-full max-w-lg">
        <p className="mb-1 font-medium">Job Title</p>
        <input
          type="text"
          placeholder="Type here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border-2 border-gray-300 rounded"
        />
      </div>

      {/* Job Description */}
      <div className="w-full max-w-lg mt-2">
        <p className="mb-1 font-medium">Job Description</p>
        <div
          ref={editorRef}
          className="border rounded bg-white overflow-hidden"
          style={{ height: '160px' }}
        />
      </div>

      {/* Category / Location / Level */}
      <div className="flex flex-col sm:flex-row gap-6 mt-3">
        <div>
          <p className="mb-1 font-medium">Job Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border-2 border-gray-300 rounded w-[160px]"
          >
            {JobCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1 font-medium">Job Location</p>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3 py-2 border-2 border-gray-300 rounded w-[160px]"
          >
            {JobLocations.map((loc, i) => (
              <option key={i} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1 font-medium">Job Level</p>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-2 border-2 border-gray-300 rounded w-[160px]"
          >
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
      </div>

      {/* Salary */}
      <div className="mt-3">
        <p className="mb-1 font-medium">Job Salary</p>
        <input
          type="number"
          min={0}
          placeholder="2500"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
          className="px-3 py-2 border-2 border-gray-300 rounded w-[140px]"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white rounded"
      >
        ADD
      </button>
    </form>
  )
}

export default AddJobs
