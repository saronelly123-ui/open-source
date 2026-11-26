
import { useEffect, useMemo, useState } from 'react'
import {
  Network,
  Search,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Package,
  GitBranch,
  Boxes,
  ChevronRight,
  X,
  ArrowDown,
  AlertTriangle,
  Play,
  CheckCircle2,
  Bug,
  Loader2,
} from 'lucide-react'

const REPOSITORY =
  'benithacyifuzo-ui/Open-source-dependency'

const BRANCH = 'development'

const LOCKFILE_URL =
  `https://raw.githubusercontent.com/${REPOSITORY}/${BRANCH}/package-lock.json`

const OSV_API = 'https://api.osv.dev/v1/querybatch'

function getPackageName(path) {
  return path.split('node_modules/').pop()
}

function buildDependencyData(lockfile) {
  const installed = lockfile.packages || {}
  const root = installed['']

  if (!root) {
    throw new Error('Invalid package-lock.json: root package not found.')
  }

  const entries = Object.entries(installed)
    .filter(([path]) => path.startsWith('node_modules/'))

  const packages = entries.map(([path, data]) => ({
    id: path,
    name: getPackageName(path),
    version: data.version || 'Unknown',
    license: data.license || 'Not specified',
    dev: Boolean(data.dev),
    optional: Boolean(data.optional),
    type: 'Transitive',
    dependencies: [],
    description: data.description || 'No description available',
  }))

  const packageMap = new Map(
    packages.map(pkg => [pkg.id, pkg])
  )

  function resolveDependency(parentPath, dependencyName) {
    let current = parentPath

    while (true) {
      const candidate = current
        ? `${current}/node_modules/${dependencyName}`
        : `node_modules/${dependencyName}`

      if (packageMap.has(candidate)) {
        return candidate
      }

      if (!current) break

      const lastNodeModules = current.lastIndexOf('/node_modules/')

      if (lastNodeModules !== -1) {
        current = current.slice(0, lastNodeModules)
      } else {
        current = ''
      }
    }

    return null
  }

  packages.forEach(pkg => {
    const packageData = installed[pkg.id]

    const dependencyNames = [
      ...Object.keys(packageData.dependencies || {}),
      ...Object.keys(packageData.optionalDependencies || {}),
    ]

    pkg.dependencies = [
      ...new Set(dependencyNames),
    ].map(name => ({
      name,
      id: resolveDependency(pkg.id, name),
    })).filter(dep => dep.id)
  })

  const rootDependencies = root.dependencies || {}
  const rootDevDependencies = root.devDependencies || {}

  const directRuntime = Object.keys(rootDependencies)
    .map(name => resolveDependency('', name))
    .filter(Boolean)

  const directDev = Object.keys(rootDevDependencies)
    .map(name => resolveDependency('', name))
    .filter(Boolean)

  const directIds = new Set([
    ...directRuntime,
    ...directDev,
  ])

  packages.forEach(pkg => {
    if (directRuntime.includes(pkg.id)) {
      pkg.type = 'Runtime'
    } else if (directDev.includes(pkg.id)) {
      pkg.type = 'Development'
    }
  })

  return {
    project: root.name || 'GitHub Project',
    version: root.version || '1.0.0',
    packages,
    directRuntime,
    directDev,
    directIds,
    packageMap,
  }
}

// Split packages into smaller groups for OSV API
function chunkArray(items, size) {
  const chunks = []

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }

  return chunks
}

// Read severity from OSV data without inventing a value
function getSeverity(vulnerability) {
  const databaseSeverity =
    vulnerability.database_specific?.severity

  const ecosystemSeverity =
    vulnerability.ecosystem_specific?.severity

  const severity = String(
    databaseSeverity || ecosystemSeverity || ''
  ).toLowerCase()

  if (severity.includes('critical')) return 'Critical'
  if (severity.includes('high')) return 'High'
  if (severity.includes('moderate') || severity.includes('medium')) {
    return 'Medium'
  }
  if (severity.includes('low')) return 'Low'

  return 'Unknown'
}

function getVulnerabilityIds(vulnerability) {
  const ids = [
    vulnerability.id,
    ...(vulnerability.aliases || []),
  ].filter(Boolean)

  return [...new Set(ids)]
}

function DependencyTree() {
  const [data, setData] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // OSV scanner states
  const [scanResults, setScanResults] = useState({})
  const [scanLoading, setScanLoading] = useState(false)
  const [scanError, setScanError] = useState('')
  const [scanComplete, setScanComplete] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  const loadRepository = async () => {
    setLoading(true)
    setError('')
    setScanError('')
    setScanResults({})
    setScanComplete(false)
    setScanProgress(0)

    try {
      const response = await fetch(LOCKFILE_URL, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(
          `Unable to read repository lock file (${response.status}).`
        )
      }

      const lockfile = await response.json()
      const result = buildDependencyData(lockfile)

      setData(result)
      setSelectedPackage(null)
    } catch (err) {
      setError(err.message || 'Failed to load repository.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRepository()
  }, [])

  // Run OSV vulnerability scan
  const runSecurityScan = async () => {
    if (!data || scanLoading) return

    setScanLoading(true)
    setScanError('')
    setScanResults({})
    setScanComplete(false)
    setScanProgress(0)

    try {
      const validPackages = data.packages.filter(
        pkg =>
          pkg.version &&
          pkg.version !== 'Unknown' &&
          pkg.name
      )

      const batches = chunkArray(validPackages, 100)

      const allResults = {}
      let completedPackages = 0

      for (const batch of batches) {
        const queries = batch.map(pkg => ({
          package: {
            name: pkg.name,
            ecosystem: 'npm',
          },
          version: pkg.version,
        }))

        const response = await fetch(OSV_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ queries }),
        })

        if (!response.ok) {
          throw new Error(
            `OSV API request failed (${response.status}). Please try again.`
          )
        }

        const result = await response.json()

        if (!Array.isArray(result.results)) {
          throw new Error(
            'Unexpected response from OSV API.'
          )
        }

        batch.forEach((pkg, index) => {
          const vulnerabilities =
            result.results[index]?.vulns || []

          allResults[pkg.id] = {
            packageName: pkg.name,
            version: pkg.version,
            vulnerabilities: vulnerabilities.map(vuln => ({
              id: vuln.id || 'Unknown ID',
              aliases: vuln.aliases || [],
              summary: vuln.summary || vuln.details || 'No description available.',
              severity: getSeverity(vuln),
              modified: vuln.modified || null,
              references: (vuln.references || []).map(
                reference => reference.url
              ).filter(Boolean),
            })),
          }
        })

        completedPackages += batch.length
        setScanProgress(completedPackages)
        setScanResults({ ...allResults })
      }

      setScanResults(allResults)
      setScanComplete(true)
    } catch (err) {
      setScanError(
        err.message ||
        'An error occurred while scanning packages.'
      )
    } finally {
      setScanLoading(false)
    }
  }

  const filteredPackages = useMemo(() => {
    if (!data) return []

    return data.packages.filter(pkg => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(search.toLowerCase())

      const matchesFilter =
        filter === 'All' ||
        (filter === 'Runtime' && pkg.type === 'Runtime') ||
        (filter === 'Development' && pkg.type === 'Development') ||
        (filter === 'Transitive' && pkg.type === 'Transitive')

      return matchesSearch && matchesFilter
    })
  }, [data, search, filter])

  const getPackage = id =>
    data?.packageMap.get(id)

  const getPackageResult = id =>
    scanResults[id]

  const totalVulnerabilities = Object.values(scanResults)
    .reduce(
      (total, result) =>
        total + result.vulnerabilities.length,
      0
    )

  const vulnerablePackages = Object.values(scanResults)
    .filter(result => result.vulnerabilities.length > 0)
    .length

  const cleanPackages = scanComplete
    ? data?.packages.filter(
        pkg =>
          scanResults[pkg.id] &&
          scanResults[pkg.id].vulnerabilities.length === 0
      ).length || 0
    : 0

  const severityCounts = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
    Unknown: 0,
  }

  Object.values(scanResults).forEach(result => {
    result.vulnerabilities.forEach(vuln => {
      severityCounts[vuln.severity]++
    })
  })

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-slate-400">
        <RefreshCw size={30} className="animate-spin text-cyan-400" />
        <p>Connecting to GitHub repository...</p>
        <p className="text-xs">Loading package-lock.json</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-[#141923] p-8 text-center">
        <AlertTriangle size={35} className="mx-auto mb-3 text-red-400" />
        <h2 className="font-bold text-white">
          Repository connection failed
        </h2>
        <p className="mt-2 text-sm text-slate-400">{error}</p>
        <button
          onClick={loadRepository}
          className="mt-5 rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950"
        >
          Try Again
        </button>
      </div>
    )
  }

  const runtimeCount = data.directRuntime.length
  const devCount = data.directDev.length
  const totalCount = data.packages.length
  const transitiveCount =
    totalCount - data.directIds.size

  const selectedResult = selectedPackage
    ? getPackageResult(selectedPackage.id)
    : null

  return (
    <div className="min-h-screen space-y-6 bg-[#0E121B] text-slate-200">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-cyan-400">
            <Network size={19} />
            <span className="font-mono text-xs uppercase tracking-widest">
              Security Analysis / Dependencies
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Dependency Tree & Graph
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Explore and scan dependencies from your connected GitHub repository.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={runSecurityScan}
            disabled={scanLoading}
            className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Play size={16} />
            )}
            {scanLoading ? 'Scanning...' : 'Scan Vulnerabilities'}
          </button>

          <button
            onClick={loadRepository}
            className="flex items-center justify-center gap-2 rounded-lg border border-[#303640] bg-[#181C24] px-4 py-3 text-sm hover:border-cyan-500 hover:text-cyan-400"
          >
            <RefreshCw size={16} />
            Refresh Repository
          </button>
        </div>
      </div>

      {/* Repository information */}
      <div className="rounded-xl border border-[#303640] bg-[#141923] p-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-3">
              <GitBranch className="text-cyan-400" size={23} />
            </div>

            <div>
              <p className="font-semibold text-white">
                {data.project}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                github.com/{REPOSITORY}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
              <ShieldCheck size={13} className="mr-1 inline" />
              Connected
            </span>
            <span className="rounded-md bg-cyan-500/10 px-3 py-2 font-mono text-xs text-cyan-400">
              {BRANCH}
            </span>
          </div>
        </div>
      </div>

      {/* Package statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Packages"
          value={totalCount}
          icon={Boxes}
          color="text-cyan-400"
        />

        <StatCard
          title="Runtime Dependencies"
          value={runtimeCount}
          icon={Package}
          color="text-blue-400"
        />

        <StatCard
          title="Development Dependencies"
          value={devCount}
          icon={GitBranch}
          color="text-purple-400"
        />

        <StatCard
          title="Transitive Dependencies"
          value={transitiveCount}
          icon={Network}
          color="text-orange-400"
        />
      </div>

      {/* OSV scan results */}
      <div className="rounded-xl border border-[#303640] bg-[#141923] p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-cyan-400" size={21} />
              <h2 className="font-semibold text-white">
                OSV Vulnerability Scanner
              </h2>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Scan installed npm package versions against the OSV vulnerability database.
            </p>
          </div>

          {scanComplete && (
            <span className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
              <CheckCircle2 size={15} />
              Scan completed
            </span>
          )}
        </div>

        {scanLoading && (
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-slate-400">
              <span>Scanning packages...</span>
              <span>{scanProgress} / {totalCount}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#252C38]">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{
                  width: `${Math.min(
                    (scanProgress / totalCount) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {scanError && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
            <p>{scanError}</p>
          </div>
        )}

        {!scanComplete && !scanLoading && !scanError && (
          <div className="mt-5 rounded-lg border border-dashed border-[#3A4554] p-5 text-center">
            <ShieldCheck size={30} className="mx-auto mb-2 text-slate-500" />
            <p className="text-sm font-medium text-slate-300">
              No vulnerability scan has been performed.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Click Scan Vulnerabilities to check all installed packages.
            </p>
          </div>
        )}

        {scanComplete && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <ScanStat
                title="Scanned Packages"
                value={Object.keys(scanResults).length}
                color="text-cyan-400"
              />
              <ScanStat
                title="Vulnerable Packages"
                value={vulnerablePackages}
                color="text-red-400"
              />
              <ScanStat
                title="Vulnerabilities Found"
                value={totalVulnerabilities}
                color="text-orange-400"
              />
              <ScanStat
                title="No Known Vulnerabilities"
                value={cleanPackages}
                color="text-emerald-400"
              />
            </div>

            <div className="mt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Severity Breakdown
              </p>

              <div className="flex flex-wrap gap-2">
                {Object.entries(severityCounts).map(([severity, count]) => (
                  <SeverityBadge
                    key={severity}
                    severity={severity}
                    count={count}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <p className="mt-4 text-[11px] leading-5 text-slate-500">
          OSV results reflect known vulnerabilities reported for the exact installed package versions.
          A clean result does not guarantee that a package is completely secure.
        </p>
      </div>

      {/* Dependency visualization */}
      <div className="overflow-hidden rounded-xl border border-[#303640] bg-[#141923]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#303640] p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-white">
              Dependency Visualization
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Select a package to inspect its relationships.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <Legend color="bg-cyan-400" label="Root" />
            <Legend color="bg-blue-400" label="Runtime" />
            <Legend color="bg-purple-400" label="Development" />
            <Legend color="bg-slate-400" label="Transitive" />
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedPackage(null)}
              className="rounded-xl border border-cyan-500/50 bg-cyan-500/10 px-8 py-4 text-center hover:border-cyan-400"
            >
              <Boxes className="mx-auto mb-2 text-cyan-400" size={25} />
              <p className="font-bold text-white">{data.project}</p>
              <p className="mt-1 font-mono text-xs text-cyan-400">
                v{data.version}
              </p>
            </button>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="text-slate-600" />
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-400">
              Runtime Dependencies ({runtimeCount})
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.directRuntime.map(id => {
                const pkg = getPackage(id)
                if (!pkg) return null

                return (
                  <PackageNode
                    key={id}
                    pkg={pkg}
                    selected={selectedPackage?.id === id}
                    onClick={setSelectedPackage}
                    getPackage={getPackage}
                    scanResult={getPackageResult(id)}
                  />
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-purple-400">
              Development Dependencies ({devCount})
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.directDev.map(id => {
                const pkg = getPackage(id)
                if (!pkg) return null

                return (
                  <PackageNode
                    key={id}
                    pkg={pkg}
                    selected={selectedPackage?.id === id}
                    onClick={setSelectedPackage}
                    getPackage={getPackage}
                    scanResult={getPackageResult(id)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected package details */}
      {selectedPackage && (
        <div className="rounded-xl border border-cyan-500/30 bg-[#141923] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold text-white">
              Package Details
            </h2>
            <button
              onClick={() => setSelectedPackage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X size={19} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Package Name" value={selectedPackage.name} />
            <Detail label="Installed Version" value={selectedPackage.version} />
            <Detail label="Package Type" value={selectedPackage.type} />
            <Detail label="License" value={selectedPackage.license} />
          </div>

          <div className="mt-5 border-t border-[#303640] pt-4">
            <p className="mb-3 text-xs font-semibold uppercase text-slate-500">
              Dependencies ({selectedPackage.dependencies.length})
            </p>

            {selectedPackage.dependencies.length ? (
              <div className="flex flex-wrap gap-2">
                {selectedPackage.dependencies.map(dep => {
                  const child = getPackage(dep.id)

                  return (
                    <button
                      key={dep.id}
                      onClick={() => child && setSelectedPackage(child)}
                      className="flex items-center gap-2 rounded-lg border border-[#303640] bg-[#1B202B] px-3 py-2 text-xs hover:border-cyan-500"
                    >
                      {dep.name}
                      <ChevronRight size={13} />
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No dependencies found.
              </p>
            )}
          </div>

          {/* Package security information */}
          <div className="mt-5 border-t border-[#303640] pt-4">
            <div className="mb-3 flex items-center gap-2">
              <ShieldAlert size={17} className="text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                Security Analysis
              </h3>
            </div>

            {!scanComplete && !selectedResult && (
              <p className="text-sm text-slate-500">
                This package has not been scanned yet.
              </p>
            )}

            {selectedResult && selectedResult.vulnerabilities.length === 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                <ShieldCheck size={18} />
                No known vulnerabilities reported by OSV for this version.
              </div>
            )}

            {selectedResult && selectedResult.vulnerabilities.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  <ShieldAlert size={18} />
                  {selectedResult.vulnerabilities.length} vulnerability record(s) found.
                </div>

                {selectedResult.vulnerabilities.map((vuln, index) => (
                  <div
                    key={`${vuln.id}-${index}`}
                    className="rounded-lg border border-[#303640] bg-[#1B202B] p-4"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <p className="font-semibold text-white">
                          {vuln.id}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {vuln.aliases.map(alias => (
                            <span
                              key={alias}
                              className="rounded bg-[#0E121B] px-2 py-1 text-[10px] text-slate-400"
                            >
                              {alias}
                            </span>
                          ))}
                        </div>
                      </div>

                      <SeverityBadge
                        severity={vuln.severity}
                      />
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {vuln.summary}
                    </p>

                    {vuln.modified && (
                      <p className="mt-3 text-xs text-slate-500">
                        Last modified: {new Date(vuln.modified).toLocaleDateString()}
                      </p>
                    )}

                    {vuln.references.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {vuln.references.slice(0, 3).map((url, refIndex) => (
                          <a
                            key={refIndex}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-cyan-400 hover:underline"
                          >
                            Reference {refIndex + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Package inventory */}
      <div className="overflow-hidden rounded-xl border border-[#303640] bg-[#141923]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#303640] p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-semibold text-white">
              Package Inventory
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Actual installed packages from package-lock.json
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search packages..."
                className="w-full rounded-lg border border-[#303640] bg-[#0E121B] py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-500 sm:w-56"
              />
            </div>

            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="rounded-lg border border-[#303640] bg-[#0E121B] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-500"
            >
              <option>All</option>
              <option>Runtime</option>
              <option>Development</option>
              <option>Transitive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-[#1B202B] text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Package</th>
                <th className="px-5 py-4">Version</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Dependencies</th>
                <th className="px-5 py-4">Security</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#303640]">
              {filteredPackages.map(pkg => {
                const result = getPackageResult(pkg.id)
                const vulnerabilityCount =
                  result?.vulnerabilities.length || 0

                return (
                  <tr key={pkg.id} className="hover:bg-[#1B202B]">
                    <td className="px-5 py-4 font-medium text-white">
                      {pkg.name}
                    </td>

                    <td className="px-5 py-4 font-mono text-xs text-slate-400">
                      {pkg.version}
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {pkg.type}
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {pkg.dependencies.length}
                    </td>

                    <td className="px-5 py-4">
                      {!result && (
                        <SecurityBadge status="Not scanned" />
                      )}

                      {result && vulnerabilityCount === 0 && (
                        <SecurityBadge status="No known vulnerabilities" />
                      )}

                      {result && vulnerabilityCount > 0 && (
                        <SecurityBadge
                          status={`${vulnerabilityCount} found`}
                          danger
                        />
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                )
              })}

              {filteredPackages.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No packages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#303640] px-5 py-3 text-xs text-slate-500">
          Showing {filteredPackages.length} of {totalCount} packages
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-[#303640] bg-[#141923] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{title}</p>
        <Icon size={20} className={color} />
      </div>
      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

function ScanStat({ title, value, color }) {
  return (
    <div className="rounded-lg border border-[#303640] bg-[#1B202B] p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  )
}

function PackageNode({
  pkg,
  selected,
  onClick,
  getPackage,
  scanResult,
}) {
  const vulnerable =
    scanResult?.vulnerabilities?.length > 0

  return (
    <button
      onClick={() => onClick(pkg)}
      className={`w-full rounded-lg border p-4 text-left transition ${
        selected
          ? 'border-cyan-400 bg-cyan-500/10'
          : 'border-[#303640] bg-[#1B202B] hover:border-cyan-500'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Package size={18} className="shrink-0 text-cyan-400" />
          <span className="truncate text-sm font-semibold text-white">
            {pkg.name}
          </span>
        </div>

        {vulnerable ? (
          <AlertTriangle size={16} className="shrink-0 text-red-400" />
        ) : (
          <ChevronRight size={15} className="shrink-0 text-slate-500" />
        )}
      </div>

      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>v{pkg.version}</span>
        <span>{pkg.dependencies.length} dependencies</span>
      </div>

      {pkg.dependencies.length > 0 && (
        <div className="mt-3 border-t border-[#303640] pt-2">
          <p className="mb-2 text-[10px] uppercase text-slate-500">
            Depends on
          </p>

          <div className="flex flex-wrap gap-1">
            {pkg.dependencies.slice(0, 4).map(dep => (
              <span
                key={dep.id}
                className="rounded bg-[#0E121B] px-2 py-1 text-[10px] text-slate-400"
              >
                {getPackage(dep.id)?.name || dep.name}
              </span>
            ))}

            {pkg.dependencies.length > 4 && (
              <span className="text-[10px] text-cyan-400">
                +{pkg.dependencies.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </button>
  )
}

function SecurityBadge({ status, danger = false }) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-xs ${
        danger
          ? 'border-red-500/30 bg-red-500/10 text-red-400'
          : status === 'No known vulnerabilities'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-slate-500/30 bg-slate-500/10 text-slate-400'
      }`}
    >
      {status}
    </span>
  )
}

function SeverityBadge({ severity, count }) {
  const styles = {
    Critical: 'border-red-500/40 bg-red-500/10 text-red-400',
    High: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
    Medium: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
    Low: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    Unknown: 'border-slate-500/40 bg-slate-500/10 text-slate-400',
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs ${styles[severity] || styles.Unknown}`}>
      {severity}
      {count !== undefined && (
        <span className="font-bold">{count}</span>
      )}
    </span>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 break-all text-sm font-medium text-slate-200">
        {value}
      </p>
    </div>
  )
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-slate-400">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  )
}

export default DependencyTree
