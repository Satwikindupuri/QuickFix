# Sample Seed Data

To test the application, you can manually add these sample providers through the registration form, or insert them directly into your Supabase database.

## Sample Providers

### Electrician - Hyderabad

**Name**: Rajesh Kumar
**Firm**: Lightning Fast Electricals
**Category**: Electrician
**City**: Hyderabad
**Phone**: +91 9876543210
**Experience**: 8 years
**Description**: Professional electrical services including wiring, repairs, installations, and maintenance. Available 24/7 for emergency services. Licensed and insured.
**Price**: ₹300 - ₹1500

---

### Plumber - Mumbai

**Name**: Amit Sharma
**Firm**: Quick Fix Plumbing
**Category**: Plumber
**City**: Mumbai
**Phone**: +91 9876543211
**Experience**: 12 years
**Description**: Expert plumbing services for residential and commercial properties. Specializing in leak repairs, pipe installations, bathroom fittings, and water heater services.
**Price**: ₹400 - ₹2000

---

### Packer & Movers - Bangalore

**Name**: Suresh Reddy
**Firm**: Safe Move Packers
**Category**: Packer & Movers
**City**: Bangalore
**Phone**: +91 9876543212
**Experience**: 15 years
**Description**: Reliable packing and moving services for local and intercity relocations. We handle household goods, office equipment, and vehicles with care. Insured services available.
**Price**: ₹5000 - ₹25000

---

### Beauty Salon - Delhi

**Name**: Priya Singh
**Firm**: Glamour Beauty Parlour
**Category**: Beauty
**City**: Delhi
**Phone**: +91 9876543213
**Experience**: 6 years
**Description**: Full-service beauty salon offering haircuts, styling, bridal makeup, facials, manicures, pedicures, and spa treatments. Professional beauticians with latest techniques.
**Price**: ₹500 - ₹15000

---

### Mechanical Services - Pune

**Name**: Vijay Patil
**Firm**: AutoCare Mechanics
**Category**: Mechanical
**City**: Pune
**Phone**: +91 9876543214
**Experience**: 10 years
**Description**: Complete automobile repair and maintenance services. Engine diagnostics, brake repairs, oil changes, AC servicing, and general maintenance for all vehicle types.
**Price**: ₹800 - ₹5000

---

### Education - Chennai

**Name**: Dr. Lakshmi Iyer
**Firm**: Excel Tutoring Center
**Category**: Education
**City**: Chennai
**Phone**: +91 9876543215
**Experience**: 18 years
**Description**: Expert tutoring services for students from Grade 8 to 12. Specializing in Mathematics, Physics, and Chemistry. Proven track record of excellent board exam results.
**Price**: ₹2000 - ₹8000 per month

---

### Food Catering - Hyderabad

**Name**: Mohammed Ali
**Firm**: Spice Garden Caterers
**Category**: Food
**City**: Hyderabad
**Phone**: +91 9876543216
**Experience**: 7 years
**Description**: Professional catering services for weddings, corporate events, and parties. Offering diverse cuisine including North Indian, South Indian, Chinese, and Continental.
**Price**: ₹200 - ₹500 per plate

---

### Interior Decoration - Mumbai

**Name**: Neha Kapoor
**Firm**: Dream Décor Studio
**Category**: Decoration
**City**: Mumbai
**Phone**: +91 9876543217
**Experience**: 9 years
**Description**: Complete interior design and decoration services for homes and offices. Specializing in modern, minimalist, and traditional themes. 3D visualization available.
**Price**: ₹15000 - ₹200000

---

## SQL Insert Query (Alternative Method)

If you prefer to insert directly into Supabase, you can use this SQL query (replace `YOUR_USER_ID` with an actual user ID from auth.users):

```sql
INSERT INTO providers (uid, name, firm_name, category, city, phone, description, experience_years, price) VALUES
('YOUR_USER_ID', 'Rajesh Kumar', 'Lightning Fast Electricals', 'Electrician', 'Hyderabad', '+91 9876543210', 'Professional electrical services including wiring, repairs, installations, and maintenance. Available 24/7 for emergency services. Licensed and insured.', 8, '₹300 - ₹1500'),
('YOUR_USER_ID', 'Amit Sharma', 'Quick Fix Plumbing', 'Plumber', 'Mumbai', '+91 9876543211', 'Expert plumbing services for residential and commercial properties. Specializing in leak repairs, pipe installations, bathroom fittings, and water heater services.', 12, '₹400 - ₹2000'),
('YOUR_USER_ID', 'Suresh Reddy', 'Safe Move Packers', 'Packer & Movers', 'Bangalore', '+91 9876543212', 'Reliable packing and moving services for local and intercity relocations. We handle household goods, office equipment, and vehicles with care. Insured services available.', 15, '₹5000 - ₹25000');
```

Note: Make sure to create a user account first and use that user's ID in the SQL query.
