import './SearchBar.scss'
import DestinationPanel from './DestinationPanel'
import { useEffect, useRef, useState } from 'react'
import GuestsPanel from './GuestsPanel'
import { FieldPanel, SearchBarField } from './SearchBarField'
import SearchButton from './SearchButton'

import { useNavigate } from 'react-router-dom'
import CalendarPanel from './CalendarPanel'
import 'moment/locale/fr'

const SearchBar = () => {
  const [selectedField, setSelectedField] = useState('')
  const [search, setSearch] = useState('')
  const [destination, setDestination] = useState('')
  const [adults, setAdults] = useState(0)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [pets, setPets] = useState(0)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const navigate = useNavigate()

  const setMinAdult = () => {
    if (!adults && (children || infants || pets)) setAdults(1)
  }

  // useEffect(() => {
  //   setMinAdult()
  // }, [children, infants, pets])

  const handleResetGuests = () => {
    setAdults(0)
    setChildren(0)
    setInfants(0)
    setPets(0)
  }

  const handleResetDate = () => {
    setStartDate(null)
    setEndDate(null)
    setSelectedField('startDate')
  }

  const handleResetDestination = () => {
    setDestination('')
    setSearch('')
  }

  const searchBarRef = useRef()

  useSearchBarClickOut(searchBarRef)

  function useSearchBarClickOut(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setSelectedField(null)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])
  }

  const handleSelectField = (fieldName) => {
    setSelectedField(fieldName)
  }

  const handleSelectDestination = (destination) => {
    setDestination(destination)
    setSelectedField('startDate')
    setSearch(destination)
  }

  const handleSearch = () => {
    if (adults && destination && startDate && endDate) {
      const params =
        'destination=' +
        destination +
        (adults ? '&adults=' + adults : '') +
        (children ? '&children=' + children : '') +
        (infants ? '&infants=' + infants : '') +
        (pets ? '&pets=' + pets : '') +
        '&startdate=' +
        startDate.format('YYYY-MM-DD') +
        '&enddate=' +
        endDate.format('YYYY-MM-DD')
      navigate(`/search/?${params}`)
    }
  }

  const getGuestsText = () => {
    const isMany = (number) => (number > 1 ? 's' : '')
    const guests = adults + children
    const text =
      guests &&
      guests +
        ' Voyageur' +
        isMany(guests) +
        (infants ? ', ' + infants + ' Bébé' + isMany(infants) : '') +
        (pets
          ? ', ' + pets + (pets > 1 ? ' Animaux' : ' Animal') + ' de compagnie'
          : '')
    return text
  }

  return (
    <div
      className={selectedField ? 'search-bar search-bar-darker' : 'search-bar'}
      ref={searchBarRef}
    >
      <div className="destination-container">
        <SearchBarField
          title="Destination"
          placeholder="Où allez-vous ?"
          selectedField={selectedField}
          fieldName="destination"
          onSelect={handleSelectField}
          inputValue={search}
          onInputValue={setSearch}
          onReset={handleResetDestination}
        >
          <FieldPanel>
            <DestinationPanel
              search={search}
              onSelect={handleSelectDestination}
            />
          </FieldPanel>
        </SearchBarField>
      </div>
      <div className="date-container">
        <SearchBarField
          title="Arrivée"
          placeholder="Quand ?"
          selectedField={selectedField}
          fieldName="startDate"
          onSelect={handleSelectField}
          disabledInput={true}
          inputValue={startDate?.format('DD MMM')}
          onReset={handleResetDate}
        >
          <FieldPanel>
            <CalendarPanel
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              focusedInput={selectedField}
              setFocusedInput={setSelectedField}
            />
          </FieldPanel>
        </SearchBarField>
      </div>

      <div className="date-container">
        <SearchBarField
          title="Départ"
          placeholder="Quand ?"
          selectedField={selectedField}
          fieldName="endDate"
          onSelect={handleSelectField}
          disabledInput={true}
        >
          <FieldPanel>
            <CalendarPanel
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              focusedInput={selectedField}
              setFocusedInput={setSelectedField}
            />
          </FieldPanel>
        </SearchBarField>
      </div>
      <div className="guests-container">
        <SearchBarField
          title="Voyageurs"
          placeholder="Qui ?"
          selectedField={selectedField}
          fieldName="guest"
          onSelect={handleSelectField}
          disabledInput={true}
          inputValue={getGuestsText()}
          onReset={handleResetGuests}
        >
          <SearchButton isExtended={selectedField} onClick={handleSearch} />
          <FieldPanel align="right">
            <GuestsPanel
              guestValues={{ adults, children, infants, pets }}
              guestHandlers={{ setAdults, setChildren, setInfants, setPets }}
            />
          </FieldPanel>
        </SearchBarField>
      </div>
    </div>
  )
}

export default SearchBar
