import MapboxComponent from '../components/mapbox'

export default function Home() {
  return (
    <div>
      <div className="h-screen w-screen">
          <MapboxComponent initialCoordinates={[10,63]} zoom={14}/>
      </div>
    </div>
  )
}
