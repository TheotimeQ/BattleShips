import { useRouter } from 'next/router'

export default function Game() {
    const router = useRouter()
    const { id } = router.query

    return <p>Game {id}</p>
}