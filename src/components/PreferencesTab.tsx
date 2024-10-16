import { Button } from "./ui/button"
import { MoonIcon, SunIcon, Volume2, VolumeX } from "lucide-react";

const preferencesTab = () => {
    return (
        <div className='flex flex-wrap gap-2 px-1 md:px-2'>
            <Button
                variant={"outline"}
                size={"icon"}
            >
                <SunIcon className='size-[1.2rem] text-muted-foreground' />
            </Button>
            <Button
                variant={"outline"}
                size={"icon"}
            >
                <MoonIcon className='size-[1.2rem] text-muted-foreground' />
            </Button>
            <Button
                variant={"outline"}
                size={"icon"}
                >
                <Volume2 className='size-[1.2rem] text-muted-foreground' />
            </Button>
        </div>
    )
}

export default preferencesTab
