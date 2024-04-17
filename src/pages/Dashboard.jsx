import CobrosCard from "../components/cards/CobrosCard"
import EntregasCard from "../components/cards/EntregasCard"
import MobiliarioTotalCard from "../components/cards/MobiliarioTotalCard"
import RecepcionCard from "../components/cards/RecepcionCard"
import ReservacionesActivasCard from "../components/cards/ReservacionesActivasCard"
import ReservacionesAgendadasVigentes from "../components/cards/ReservacionesAgendadasVigentes"

export default function Dashboard() {

  return (
    <div>
      <h2 style={{textAlign:"center"}}>Dashboard</h2>
    <section className="dashboard-container">
      <CobrosCard/>
      <ReservacionesActivasCard/>
      <ReservacionesAgendadasVigentes/>
      <EntregasCard/>
      <RecepcionCard/>
      <MobiliarioTotalCard/>
    </section>
    </div>
  )
}