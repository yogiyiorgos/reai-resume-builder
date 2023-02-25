import { useState } from 'react'
import Loading from './Loading'

const Home = () => {
  const [fullName, setFullName] = useState('')
  const [currentPosition, setCurrentPosition] = useState('')
  const [currentLength, setCurrentLength] = useState('')
  const [currentTechnologies, setCurrentTechnologies] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [companyInfo, setCompanyInfo] = useState([{ name: '', position: '' }])

  // Update the state with the user's info
  const handleAddCompany = () =>
    setCompanyInfo([...companyInfo, { name: '', position: '' }])

  // Remove a selected item from the list
  const handleRemoveCompany = (index) => {
    // Create a new array to avoid mutating the original array
    const list = [...companyInfo]

    // Remove 1 element in the list array at the index
    list.splice(index, 1)

    // Update the companyInfo state with the new array
    setCompanyInfo(list)
  }

  // Update an item within the list at the given index
  const handleUpdateCompany = (e, index) => {
    // Access the name and value of the input field that triggered the event
    const { name, value } = e.target
    const list = [...companyInfo]

    // Change the object at the index, change the name part of that object
    list[index][name] = value
    setCompanyInfo(list)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    console.log({
      fullName,
      currentPosition,
      currentLength,
      currentTechnologies,
      headshot,
    })
    setLoading(true)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className='app'>
      <h1>Resume Builder</h1>
      <p>Generate a resume with the help of AI</p>
      <form
        onSubmit={handleFormSubmit}
        method='POST'
        encType='multipart/form-data'
      >
        <label htmlFor='fullName'>Enter your full name</label>
        <input
          type='text'
          required
          name='fullName'
          id='fullName'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <div className='nestedContainer'>
          <div>
            <label htmlFor='currentPosition'>Current Position</label>
            <input
              type='text'
              required
              name='currentPosition'
              className='currentInput'
              value={currentPosition}
              onChange={(e) => setCurrentPosition(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='currentLength'>For how long? (years)</label>
            <input
              type='number'
              required
              name='currentLength'
              className='currentInput'
              value={currentLength}
              onChange={(e) => setCurrentLength(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='currentTechnologies'>Technologies used</label>
            <input
              type='text'
              required
              name='currentTechnologies'
              className='currentInput'
              value={currentTechnologies}
              onChange={(e) => setCurrentTechnologies(e.target.value)}
            />
          </div>
        </div>
        <label htmlFor='photo'>Upload your avatar</label>
        <input
          type='file'
          name='photo'
          required
          id='photo'
          accept='image/x-png,image/jpeg'
          onChange={(e) => setAvatar(e.target.files[0])}
        />

        <h3>Companies that you have worked at.</h3>

        {companyInfo.map((company, index) => (
          <div
            className='nestedContainer'
            key='{index}'
          >
            <div className='companies'>
              <label htmlFor='name'>Company Name</label>
              <input
                type='text'
                name='name'
                required
                onChange={(e) => handleUpdateCompany(e, index)}
              />
            </div>
            <div className='companies'>
              <label htmlFor='position'>Position</label>
              <input
                type='text'
                name='position'
                required
                onChange={(e) => handleUpdateCompany(e, index)}
              />
            </div>

            <div className='btn__group'>
              {companyInfo.length - 1 === index && companyInfo.length < 4 && (
                <button
                  id='addBtn'
                  onClick={handleAddCompany}
                >
                  Add
                </button>
              )}
              {companyInfo.length > 1 && (
                <button
                  id='deleteBtn'
                  onClick={() => handleRemoveCompany(index)}
                >
                  Del
                </button>
              )}
            </div>
          </div>
        ))}

        <button>Create Resume</button>
      </form>
    </div>
  )
}

export default Home
