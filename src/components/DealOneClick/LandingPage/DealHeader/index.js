import React, { useState, useEffect } from 'react';
import './DealHeader.scss';

function DealHeader({ deal }) {
  const { company_name, company_description, slug } = deal;
  const [img, setImg] = useState();
  useEffect(() => {
    setImg(`https://allocations-public.s3.us-east-2.amazonaws.com/deals/${slug}.png`);
  }, [slug]);
  return (
    <section className="DealHeader">
      <h1 className="deal-title">{company_name}</h1>
      <h3 className="deal-description">{company_description}</h3>
      <img
        className="image-wrapper"
        alt={slug}
        onError={() => setImg('https://allocations-public.s3.us-east-2.amazonaws.com/deals/default.png')}
        src={img}
      />
    </section>
  );
}

export default DealHeader;
