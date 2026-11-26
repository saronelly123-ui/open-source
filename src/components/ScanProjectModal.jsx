
import { useRef, useState } from 'react'
import {
  scanGithubRepository,
  scanLocalProject,
} from '../services/scanner'

import {
  X,
  GitBranch,
  FolderOpen,
  LoaderCircle,
  CheckCircle2,
  Upload,
} from 'lucide-react'

function ScanProjectModal({ onClose, onScanComplete }) {
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
  })

  const folderInputRef = useRef(null)

  const handleGithubScan = async (e) => {
    e.preventDefault()

    if (!repositoryUrl.trim()) {
      setFeedback({
        type: 'error',
        message: 'Enter a public GitHub repository URL.',
      })
      return
    }

    try {
      const url = new URL(repositoryUrl.trim())

      if (
        url.protocol !== 'https:' ||
        url.hostname !== 'github.com' ||
        url.pathname.split('/').filter(Boolean).length < 2
      ) {
        throw new Error('Enter a valid public GitHub repository URL.')
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Invalid GitHub URL.',
      })
      return
    }

    setLoading(true)

    setFeedback({
      type: 'loading',
      message: 'Scanning GitHub repository with OSV.dev...',
    })

    try {
      const result = await scanGithubRepository(
        repositoryUrl.trim()
      )

      setFeedback({
        type: 'success',
        message: `Scan completed: ${result.packages} packages checked and ${result.vulnerabilityCount} vulnerabilities found.`,
      })

      onScanComplete(result)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Repository scan failed.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFolderSelection = async (event) => {
    const files = Array.from(event.target.files || [])

    if (!files.length) return

    const lockFile = files.find((file) =>
      file.webkitRelativePath
        .split('/')
        .length === 2 &&
      (
        file.name === 'package-lock.json' ||
        file.name === 'npm-shrinkwrap.json'
      )
    )

    if (!lockFile) {
      setFeedback({
        type: 'error',
        message:
          'No package-lock.json or npm-shrinkwrap.json was found in the selected folder. Select your project root folder.',
      })

      event.target.value = ''
      return
    }

    setLoading(true)

    setFeedback({
      type: 'loading',
      message: 'Reading local project and checking packages with OSV.dev...',
    })

    try {
      const lockfileText = await lockFile.text()
      const lockfile = JSON.parse(lockfileText)

      const projectName =
        lockFile.webkitRelativePath.split('/')[0]

      const result = await scanLocalProject(
        lockfile,
        projectName,
        lockFile.name
      )

      setFeedback({
        type: 'success',
        message: `Scan completed: ${result.packages} packages checked and ${result.vulnerabilityCount} vulnerabilities found.`,
      })

      onScanComplete(result)
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error.message || 'Local project scan failed.',
      })
    } finally {
      setLoading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#303640] bg-[#1C2028] shadow-2xl">

        <div className="flex items-center justify-between border-b border-[#303640] p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              Start New Security Scan
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Scan a GitHub repository or a local npm project.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-[#303640] hover:text-white disabled:opacity-50"
            aria-label="Close scan dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleGithubScan}
          className="space-y-5 p-5"
        >
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <GitBranch size={17} className="text-cyan-400" />
              GitHub Repository URL
            </label>

            <input
              type="url"
              value={repositoryUrl}
              disabled={loading}
              onChange={(e) => {
                setRepositoryUrl(e.target.value)
                setFeedback({ type: '', message: '' })
              }}
              placeholder="https://github.com/username/repository"
              className="w-full rounded-lg border border-[#303640] bg-[#181C24] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#303640]" />
            <span className="text-xs font-semibold text-slate-500">
              OR
            </span>
            <div className="h-px flex-1 bg-[#303640]" />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Upload size={17} className="text-cyan-400" />
              Scan Local Project Folder
            </label>

            <input
              ref={folderInputRef}
              type="file"
              webkitdirectory=""
              directory=""
              multiple
              hidden
              disabled={loading}
              onChange={handleFolderSelection}
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => folderInputRef.current?.click()}
              className="flex w-full flex-col items-center rounded-xl border border-dashed border-[#303640] bg-[#181C24] px-5 py-7 text-center transition hover:border-cyan-500 hover:bg-[#202630] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FolderOpen
                size={30}
                className="mb-3 text-cyan-400"
              />

              <span className="text-sm font-semibold text-slate-200">
                Select Project Folder
              </span>

              <span className="mt-1 text-xs text-slate-500">
                Choose a folder containing package-lock.json
              </span>
            </button>
          </div>

          {feedback.message && (
            <div
              className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                feedback.type === 'error'
                  ? 'border-red-500/30 bg-red-500/10 text-red-400'
                  : feedback.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
              }`}
              role={feedback.type === 'error' ? 'alert' : 'status'}
            >
              {feedback.type === 'loading' ? (
                <LoaderCircle
                  size={18}
                  className="shrink-0 animate-spin"
                />
              ) : feedback.type === 'success' ? (
                <CheckCircle2
                  size={18}
                  className="shrink-0"
                />
              ) : null}

              <span>{feedback.message}</span>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-[#303640] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-[#303640] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-[#303640]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-bold text-[#0A0E16] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
              )}

              {loading ? 'Scanning...' : 'Analyze GitHub Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScanProjectModal
