import authorData from '../data/author.json';

function AboutPage() {
    return (
        <div className="inner-page">

            <div className="page-header">
                <div className="page-header-inner">
                    <span className="section-kicker">The Author</span>
                    <h1 className="page-title">About George</h1>
                </div>
            </div>

            <div className="section-inner">
                <div className="about-layout">
                    <div className="about-text">
                        {authorData.bio.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                    <div className="about-photo">
                        <img
                            src={`${process.env.PUBLIC_URL}/${authorData.profileImage}`}
                            alt={authorData.name}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AboutPage;
