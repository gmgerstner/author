function PrivacyPage() {
    return (
        <div className="inner-page">

            <div className="page-header">
                <div className="page-header-inner">
                    <span className="section-kicker">Legal</span>
                    <h1 className="page-title">Privacy Policy</h1>
                </div>
            </div>

            <div className="section-inner">
                <div className="privacy-content">
                    <p className="privacy-updated">Last updated: March 19, 2026</p>

                    <h2>Overview</h2>
                    <p>
                        This website is operated by George M. Garber (GMG Novels). Your privacy matters.
                        This policy explains what information is collected when you visit this site and how it is used.
                    </p>

                    <h2>Information Collected</h2>
                    <p>
                        This site does not directly collect personal information unless you choose to provide it
                        through the contact form or by joining the reader community (newsletter signup).
                        When you use these forms, the information you submit — such as your name and email address —
                        is used solely to respond to your inquiry or send you updates you've opted into.
                    </p>

                    <h2>Third-Party Services</h2>
                    <p>This site uses the following third-party services, each with their own privacy policies:</p>
                    <ul>
                        <li>
                            <strong>Web3Forms</strong> — processes contact form submissions. Your submitted data
                            is transmitted to their servers to deliver your message.
                        </li>
                        <li>
                            <strong>GitHub Pages</strong> — hosts this website. GitHub may collect basic
                            server logs including IP addresses.
                        </li>
                    </ul>

                    <h2>Cookies</h2>
                    <p>
                        This site does not use tracking cookies or analytics. No advertising networks or
                        third-party trackers are embedded on this site.
                    </p>

                    <h2>External Links</h2>
                    <p>
                        This site contains links to external platforms such as Amazon, BookBub, and social media.
                        These sites have their own privacy policies and this policy does not cover them.
                    </p>

                    <h2>Children's Privacy</h2>
                    <p>
                        This site is not directed at children under the age of 13 and does not knowingly
                        collect information from children.
                    </p>

                    <h2>Contact</h2>
                    <p>
                        If you have any questions about this privacy policy, please use the{' '}
                        <a href="contact">contact page</a> to get in touch.
                    </p>
                </div>
            </div>

        </div>
    );
}

export default PrivacyPage;
