const industry = `
Extract industry, sector, industry group, according to GICS:


## Sector: Energy (10)

### Energy (1010)
  * Energy Equipment & Services (101010)
    - Oil & Gas Drilling (10101010)
    - Oil & Gas Equipment & Services (10101020)
  * Oil, Gas & Consumable Fuels (101020)
    - Integrated Oil & Gas (10102010)
    - Oil & Gas Exploration & Production (10102020)
    - Oil & Gas Refining & Marketing (10102030)
    - Oil & Gas Storage & Transportation (10102040)
    - Coal & Consumable Fuels (10102050)

## Sector: Materials (15)

### Materials (1510)
  * Chemicals (151010)
    - Commodity Chemicals (15101010)
    - Diversified Chemicals (15101020)
    - Fertilizers & Agricultural Chemicals (15101030)
    - Industrial Gases (15101040)
    - Specialty Chemicals (15101050)
  * Construction Materials (151020)
    - Construction Materials (15102010)
  * Containers & Packaging (151030)
    - Metal, Glass & Plastic Containers (15103010)
    - Paper & Plastic Packaging Products & Materials (15103020)
  * Metals & Mining (151040)
    - Aluminum (15104010)
    - Diversified Metals & Mining (15104020)
    - Copper (15104025)
    - Gold (15104030)
    - Precious Metals & Minerals (15104040)
    - Silver (15104045)
    - Steel (15104050)
  * Paper & Forest Products (151050)
    - Forest Products (15105010)
    - Paper Products (15105020)

## Sector: Industrials (20)

### Capital Goods (2010)
  * Aerospace & Defense (201010)
    - Aerospace & Defense (20101010)
  * Building Products (201020)
    - Building Products (20102010)
  * Construction & Engineering (201030)
    - Construction & Engineering (20103010)
  * Electrical Equipment (201040)
    - Electrical Components & Equipment (20104010)
    - Heavy Electrical Equipment (20104020)
  * Industrial Conglomerates (201050)
    - Industrial Conglomerates (20105010)
  * Machinery (201060)
    - Construction Machinery & Heavy Transportation Equipment (20106010)
    - Agricultural & Farm Machinery (20106015)
    - Industrial Machinery & Supplies & Components (20106020)
  * Trading Companies & Distributors (201070)
    - Trading Companies & Distributors (20107010)
### Commercial & Professional Services (2020)
  * Commercial Services & Supplies (202010)
    - Commercial Printing (20201010)
    - Environmental & Facilities Services (20201050)
    - Office Services & Supplies (20201060)
    - Diversified Support Services (20201070)
    - Security & Alarm Services (20201080)
  * Professional Services (202020)
    - Human Resource & Employment Services (20202010)
    - Research & Consulting Services (20202020)
    - Data Processing & Outsourced Services (20202030)
### Transportation (2030)
  * Air Freight & Logistics (203010)
    - Air Freight & Logistics (20301010)
  * Passenger Airlines (203020)
    - Passenger Airlines (20302010)
  * Marine Transportation (203030)
    - Marine Transportation (20303010)
  * Ground Transportation (203040)
    - Rail Transportation (20304010)
    - Cargo Ground Transportation (20304030)
    - Passenger Ground Transportation (20304040)
  * Transportation Infrastructure (203050)
    - Airport Services (20305010)
    - Highways & Railtracks (20305020)
    - Marine Ports & Services (20305030)

## Sector: Consumer Discretionary (25)

### Automobiles & Components (2510)
  * Automobile Components (251010)
    - Automotive Parts & Equipment (25101010)
    - Tires & Rubber (25101020)
  * Automobiles (251020)
    - Automobile Manufacturers (25102010)
    - Motorcycle Manufacturers (25102020)
### Consumer Durables & Apparel (2520)
  * Household Durables (252010)
    - Consumer Electronics (25201010)
    - Home Furnishings (25201020)
    - Homebuilding (25201030)
    - Household Appliances (25201040)
    - Housewares & Specialties (25201050)
  * Leisure Products (252020)
    - Leisure Products (25202010)
  * Textiles, Apparel & Luxury Goods (252030)
    - Apparel, Accessories & Luxury Goods (25203010)
    - Footwear (25203020)
    - Textiles (25203030)
### Consumer Services (2530)
  * Hotels, Restaurants & Leisure (253010)
    - Casinos & Gaming (25301010)
    - Hotels, Resorts & Cruise Lines (25301020)
    - Leisure Facilities (25301030)
    - Restaurants (25301040)
  * Diversified Consumer Services (253020)
    - Education Services (25302010)
    - Specialized Consumer Services (25302020)
### Consumer Discretionary Distribution & Retail (2550)
  * Distributors (255010)
    - Distributors (25501010)
  * Broadline Retail (255030)
    - Broadline Retail (25503030)
  * Specialty Retail (255040)
    - Apparel Retail (25504010)
    - Computer & Electronics Retail (25504020)
    - Home Improvement Retail (25504030)
    - Other Specialty Retail (25504040)
    - Automotive Retail (25504050)
    - Homefurnishing Retail (25504060)

## Sector: Consumer Staples (30)

### Consumer Staples Distribution & Retail (3010)
  * Consumer Staples Distribution & Retail (301010)
    - Drug Retail (30101010)
    - Food Distributors (30101020)
    - Food Retail (30101030)
    - Consumer Staples Merchandise Retail (30101040)
### Food, Beverage & Tobacco (3020)
  * Beverages (302010)
    - Brewers (30201010)
    - Distillers & Vintners (30201020)
    - Soft Drinks & Non-alcoholic Beverages (30201030)
  * Food Products (302020)
    - Agricultural Products & Services (30202010)
    - Packaged Foods & Meats (30202030)
  * Tobacco (302030)
    - Tobacco (30203010)
### Household & Personal Products (3030)
  * Household Products (303010)
    - Household Products (30301010)
  * Personal Care Products (303020)
    - Personal Care Products (30302010)

## Sector: Health Care (35)

### Health Care Equipment & Services (3510)
  * Health Care Equipment & Supplies (351010)
    - Health Care Equipment (35101010)
    - Health Care Supplies (35101020)
  * Health Care Providers & Services (351020)
    - Health Care Distributors (35102010)
    - Health Care Services (35102015)
    - Health Care Facilities (35102020)
    - Managed Health Care (35102030)
  * Health Care Technology (351030)
    - Health Care Technology (35103010)
### Pharmaceuticals, Biotechnology & Life Sciences (3520)
  * Biotechnology (352010)
    - Biotechnology (35201010)
  * Pharmaceuticals (352020)
    - Pharmaceuticals (35202010)
  * Life Sciences Tools & Services (352030)
    - Life Sciences Tools & Services (35203010)

## Sector: Financials (40)

### Banks (4010)
  * Banks (401010)
    - Diversified Banks (40101010)
    - Regional Banks (40101015)
### Financial Services (4020)
  * Financial Services (402010)
    - Diversified Financial Services (40201020)
    - Multi-Sector Holdings (40201030)
    - Specialized Finance (40201040)
    - Commercial & Residential Mortgage Finance (40201050)
    - Transaction & Payment Processing Services (40201060)
  * Consumer Finance (402020)
    - Consumer Finance (40202010)
  * Capital Markets (402030)
    - Asset Management & Custody Banks (40203010)
    - Investment Banking & Brokerage (40203020)
    - Diversified Capital Markets (40203030)
    - Financial Exchanges & Data (40203040)
  * Mortgage Real Estate Investment Trusts (REITs) (402040)
    - Mortgage REITs (40204010)
### Insurance (4030)
  * Insurance (403010)
    - Insurance Brokers (40301010)
    - Life & Health Insurance (40301020)
    - Multi-line Insurance (40301030)
    - Property & Casualty Insurance (40301040)
    - Reinsurance (40301050)

## Sector: Information Technology (45)

### Software & Services (4510)
  * IT Services (451020)
    - IT Consulting & Other Services (45102010)
    - Internet Services & Infrastructure (45102030)
  * Software (451030)
    - Application Software (45103010)
    - Systems Software (45103020)
### Technology Hardware & Equipment (4520)
  * Communications Equipment (452010)
    - Communications Equipment (45201020)
  * Technology Hardware, Storage & Peripherals (452020)
    - Technology Hardware, Storage & Peripherals (45202030)
  * Electronic Equipment, Instruments & Components (452030)
    - Electronic Equipment & Instruments (45203010)
    - Electronic Components (45203015)
    - Electronic Manufacturing Services (45203020)
    - Technology Distributors (45203030)
### Semiconductors & Semiconductor Equipment (4530)
  * Semiconductors & Semiconductor Equipment (453010)
    - Semiconductor Materials & Equipment (45301010)
    - Semiconductors (45301020)

## Sector: Communication Services (50)

### Telecommunication Services (5010)
  * Diversified Telecommunication Services (501010)
    - Alternative Carriers (50101010)
    - Integrated Telecommunication Services (50101020)
  * Wireless Telecommunication Services (501020)
    - Wireless Telecommunication Services (50102010)
### Media & Entertainment (5020)
  * Media (502010)
    - Advertising (50201010)
    - Broadcasting (50201020)
    - Cable & Satellite (50201030)
    - Publishing (50201040)
  * Entertainment (502020)
    - Movies & Entertainment (50202010)
    - Interactive Home Entertainment (50202020)
  * Interactive Media & Services (502030)
    - Interactive Media & Services (50203010)

## Sector: Utilities (55)

### Utilities (5510)
  * Electric Utilities (551010)
    - Electric Utilities (55101010)
  * Gas Utilities (551020)
    - Gas Utilities (55102010)
  * Multi-Utilities (551030)
    - Multi-Utilities (55103010)
  * Water Utilities (551040)
    - Water Utilities (55104010)
  * Independent Power and Renewable Electricity Producers (551050)
    - Independent Power Producers & Energy Traders (55105010)
    - Renewable Electricity (55105020)

## Sector: Real Estate (60)

### Equity Real Estate Investment Trusts (REITs) (6010)
  * Diversified REITs (601010)
    - Diversified REITs (60101010)
  * Industrial REITs (601025)
    - Industrial REITs (60102510)
  * Hotel & Resort REITs (601030)
    - Hotel & Resort REITs (60103010)
  * Office REITs (601040)
    - Office REITs (60104010)
  * Health Care REITs (601050)
    - Health Care REITs (60105010)
  * Residential REITs (601060)
    - Multi-Family Residential REITs (60106010)
    - Single-Family Residential REITs (60106020)
  * Retail REITs (601070)
    - Retail REITs (60107010)
  * Specialized REITs (601080)
    - Other Specialized REITs (60108010)
    - Self-Storage REITs (60108020)
    - Telecom Tower REITs (60108030)
    - Timber REITs (60108040)
    - Data Center REITs (60108050)
### Real Estate Management & Development (6020)
  * Real Estate Management & Development (602010)
    - Diversified Real Estate Activities (60201010)
    - Real Estate Operating Companies (60201020)
    - Real Estate Development (60201030)
    - Real Estate Services (60201040)

Just reply with the information in json format:

\`\`\`json
{
   "industry_gics": {
      "name": "Gas Utilities",
      "sector": {
        "code": "55",
        "name": "Utilities"
      },
      "group": {
        "code": "5510",
        "name": "Utilities"
      },
      "industry": {
        "code": "551020",
        "name": "Gas Utilities"
      },
      "subIndustry": {
        "code": "55102010",
        "name": "Gas Utilities"
      },
   }
 }
\`\`\`
`

export default industry
