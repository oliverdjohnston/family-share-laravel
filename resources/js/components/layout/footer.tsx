import { Copyright, Github, Linkedin, Mail } from "lucide-react";
import { LinkButton } from "../ui/link-button";

export function Footer() {
    return (
        <footer className="border-border bg-card/20 border-t">
            <div className="max-w-8xl container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-2">
                    <div className="flex items-center">
                        <span className="inline-flex items-center text-sm font-semibold sm:text-base">
                            <Copyright className="mr-2 h-4 w-4" />
                            oliverdjohnston, {new Date().getFullYear()}
                        </span>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                        <LinkButton href="https://github.com/oliverdjohnston" external={true} variant="link" className="py-2 sm:py-0">
                            <Github className="h-4 w-4" />
                            GitHub
                        </LinkButton>
                        <LinkButton
                            href="https://www.linkedin.com/in/oliver-dean-johnston-50096b243/"
                            external={true}
                            variant="link"
                            className="py-2 sm:py-0"
                        >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                        </LinkButton>
                        <LinkButton href="mailto:contact@oliver.cool" external={true} variant="link" className="py-2 sm:py-0">
                            <Mail className="h-4 w-4" />
                            Contact
                        </LinkButton>
                    </div>
                </div>
            </div>
        </footer>
    );
}
