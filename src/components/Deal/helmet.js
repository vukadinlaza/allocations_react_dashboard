import React from "react";
import { Helmet } from "react-helmet";

const Helm = ({ deal = {} }) => {
    return (
        <Helmet>
            <meta name="description" content={`${deal.company_description}`} />
            <meta name="keywords" content={`SPV, Fund, Funds, ${deal.company_name}`} />
            <meta name="author" content={deal.deal_lead} />
            <title>{deal.company_name} SPV </title>
        </Helmet>
    );
};

export default Helm