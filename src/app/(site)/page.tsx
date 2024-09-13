import Hero from './components/Hero'
import Image from 'next/image'
export default function Home() {
  return (
    <>
      <Hero />
      <section className="text-center mt-24">
        <p className="text-gray-600">Trusted by those companies:</p>
        <div className="flex gap-6 *:h-6 justify-center mt-4">
          <Image
            src="https://images.ctfassets.net/lh3zuq09vnm2/1FA2gEsWeu2MyGSy6Qp6ao/859833105cdd6ed5cc75eb5e4bd9cff7/HelloFresh.svg"
            alt=""
            width="100"
            height="24"
          />
          <Image
            src="https://images.ctfassets.net/lh3zuq09vnm2/vHHaKAaEeQuNcucdWM50V/23351da3b1ad9d7483ddf11aed64b4b7/Mixpanel.svg"
            alt=""
            width="100"
            height="24"
          />
          <Image
            src="https://images.ctfassets.net/lh3zuq09vnm2/4Y87kRrhSPSYgUbSWYxP1z/a13177cf43f99e7a79c691c54e271a98/Hubspot.svg"
            alt=""
            width="100"
            height="24"
          />
          <Image
            src="https://images.ctfassets.net/lh3zuq09vnm2/6jZ182ywMavcqhY7WiLS5x/fb3c393066ae09dc17819472dc605d8f/15Five.svg"
            alt=""
            width="100"
            height="24"
          />
        </div>
      </section>
    </>
  )
}
