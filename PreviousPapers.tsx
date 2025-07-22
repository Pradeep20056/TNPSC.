import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Download, FileText, Search, Filter } from 'lucide-react'
import { papersAPI } from '@/utils/api'

const PreviousPapers: React.FC = () => {
  const [papers, setPapers] = useState<any[]>([])
  const [filteredPapers, setFilteredPapers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPapers()
  }, [])

  useEffect(() => {
    filterPapers()
  }, [papers, searchTerm, selectedYear, selectedSubject, selectedType])

  const fetchPapers = async () => {
    try {
      setLoading(true)
      const response = await papersAPI.getAll()
      setPapers(response.data)
    } catch (error) {
      console.error('Error fetching papers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPapers = () => {
    let filtered = papers

    if (searchTerm) {
      filtered = filtered.filter(paper =>
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedYear) {
      filtered = filtered.filter(paper => paper.year === selectedYear)
    }

    if (selectedSubject) {
      filtered = filtered.filter(paper => paper.subject === selectedSubject)
    }

    if (selectedType) {
      filtered = filtered.filter(paper => paper.exam_type === selectedType)
    }

    setFilteredPapers(filtered)
  }

  const getUniqueValues = (key: string) => {
    return [...new Set(papers.map(paper => paper[key]))].filter(Boolean)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownload = (paper: any) => {
    // In a real application, this would download the actual PDF file
    alert(`Downloading: ${paper.title}`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedYear('')
    setSelectedSubject('')
    setSelectedType('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading question papers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Previous Year Question Papers</h2>
        <p className="text-gray-600">Access and download TNPSC previous year question papers with answer keys</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Papers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Year Filter */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Years</SelectItem>
                {getUniqueValues('year').map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subject Filter */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {getUniqueValues('subject').map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Exam Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Exam Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {getUniqueValues('exam_type').map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredPapers.length} of {papers.length} question papers
        </p>
      </div>

      {/* Papers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.map((paper) => (
          <Card key={paper.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge className={getDifficultyColor(paper.difficulty)}>
                    {paper.difficulty}
                  </Badge>
                  <CardTitle className="text-lg mt-2 leading-tight">
                    {paper.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {paper.subject} • {paper.exam_type}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  {paper.year}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Paper Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(paper.exam_date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{paper.duration_hours} hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>{paper.total_questions} questions</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  onClick={() => handleDownload(paper)} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Paper
                </Button>
                {paper.has_answer_key && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload({...paper, title: `${paper.title} - Answer Key`})}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Answer Key
                  </Button>
                )}
              </div>

              {/* Additional Info */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Added: {formatDate(paper.created_at)}</span>
                  {paper.has_answer_key && (
                    <Badge variant="secondary" className="text-xs">
                      With Solutions
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPapers.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or clearing the filters
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default PreviousPapers