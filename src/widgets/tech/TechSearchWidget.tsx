'use client'

import React, { useState } from 'react'
import { fetchTech } from '@/features/tech/api/fetchTech'
import TechSearchInput from '@/features/tech/ui/TechSearchInput'
import TechResultCard from '@/features/tech/ui/TechResultCard'

const TechSearchWidget = () => {
  const [query, setQuery] = useState('')
  const [tech, setTech] = useState(null)

  const handleSearch = async () => {
    const result = await fetchTech(query)

    setTech({
      ...result.data,
      fromDB: result.found,
    })
  }

  return (
    <div className="mx-auto mt-10 max-w-xl">
      <TechSearchInput
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
      />
      {tech && <TechResultCard tech={tech} />}
    </div>
  )
}

export default TechSearchWidget
