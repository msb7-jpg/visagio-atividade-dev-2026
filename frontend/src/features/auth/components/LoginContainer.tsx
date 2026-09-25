import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import { useLoginForm } from '@/features/auth/hooks/useLoginForm'
import { useLocation } from 'react-router-dom'
import { LoginCardView } from './LoginCardView'
import { SyncVisualShowcase } from './subcomponents/SyncVisualShowcase'

export function LoginContainer() {
  const location = useLocation()
  const fromLocation =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const formProps = useLoginForm({ fromLocation })

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="#0c0d12"
      gradientBackgroundEnd="#151722"
      firstColor="245, 158, 11"
      secondColor="168, 85, 247"
      thirdColor="59, 130, 246"
      fourthColor="234, 88, 12"
      fifthColor="126, 34, 206"
      size="70%"
      blendingValue="screen"
    >
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-6 md:flex-row md:items-center md:gap-10">
          <div className="flex w-full flex-1 items-center justify-center">
            <LoginCardView {...formProps} />
          </div>

          <div className="hidden w-full flex-1 items-center justify-center md:flex">
            <SyncVisualShowcase />
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  )
}
