import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Loading from "../../common/components/Loading/Loading"
import { ROUTES } from "../../common/constant/router"
import { useAuthStore } from "../../common/store/useAuthStore"

const Logout = () => {
	const navigate = useNavigate()
	const {logout} = useAuthStore()

	useEffect(() => {
		logout()
		navigate(ROUTES.LOGIN, { replace: true })
	}, [logout, navigate])

	return <Loading />
}

export default Logout
