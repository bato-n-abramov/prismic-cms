import { PrismicRichText } from "@prismicio/react";
import Image from "next/image";
import Link from "next/link";

const Footer = ({ settings }) => {
    if (!settings) return null;
    const logo = settings.footer_logo;
    const socials = settings.footer_socials || [];
    const navItems = settings.header_nav || [];
    const description = settings.footer_description;
    const copyright = settings.footer_copyright;
    const privacy = settings.footer_privacy_policy;

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__top">
                    <div className="footer__left">
                        <div className="footer__logo">
                            <Image src={logo.url} alt={logo.alt || "Stepwise"} width={300} height={300} />

                        </div>
                        <div className="footer__info">
                            <div className="footer__socials">
                                {socials.map((item, index) => {

                                    const href = item.link.url || "#";
                                    if (!item.icon) return null;

                                    return (
                                        <Link
                                            key={index}
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="footer__social"
                                        >
                                            <Image src={item.icon.url} alt={item.icon.alt || "Stepwise"} width={300} height={300} />
                                        </Link>
                                    );
                                })}
                            </div>
                            {description && (
                                <div className="footer__description">
                                    <PrismicRichText field={description} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="footer__right">
                        <p className="footer__quick-title">Quick links</p>
                        <div className="footer__quicklinks">
                            {navItems.map((item, index) => {
                                const href = item.link.url || "#";
                                const label = item.link.text || "";
                                return (
                                    <Link key={index} href={href} className="footer__quicklink">
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="footer__bottom">
                    <div className="footer__bottom-inner">
                        {copyright && (
                            <span className="footer__copy">{copyright}</span>
                        )}

                        {privacy?.url && (
                            <Link href={privacy.url} className="footer__privacy">
                                Privacy Policy
                            </Link>
                        )}
                        <div className="footer__title-wrapper">
                            <div className="footer__title site-title">Stepwise</div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
