import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import ErrorPage from './ErrorPage'

const Resume = ({ result }) => {
  const componentRef = useRef()

  const handlePrint = useReactToPrint({
    constent: () => componentRef.current,
    documentTitle: `${result.fullName} Resume`,
    onAfterPrint: () => alert('Print successful!'),
  })

  // Replace the new line with a break tag
  const replaceWithBr = (string) => {
    return string.replace(/\n/g, '<br />')
  }

  // Return an error page if the result object is empty
  if (JSON.stringify(result) === '{}') {
    return <ErrorPage />
  }

  return (
    <>
      <button onClick={handlePrint}>Print Page</button>
      <main
        className='container'
        ref={componentRef}
      >
        <header className='header'>
          <div>
            <h1>{result.fullName}</h1>
            <p className='resumeTitle headerTitle'>
              {result.currentPosition} ({result.currentTechnologies})
            </p>
            <p className='resumeTitle'>
              {result.currentLength}(year(s) work experience)
            </p>
          </div>
          <div>
            <img
              src={result.image_url}
              alt={result.fullName}
              className='resumeImage'
            />
          </div>
        </header>
        <div className='resumeBody'>
          <div>
            <h2 className='resumeTitle'>PROFILE SUMMARY</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: replaceWithBr(result.jobResponsibilities),
              }}
              className='resumeBodyContent'
            />
          </div>
          <div>
            <h2 className='resumeBodyTitle'>JOB RESPONSIBILITIES</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: replaceWithBr(result.keypoints),
              }}
              className='resumeBodyContent'
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default Resume
