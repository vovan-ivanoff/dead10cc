"use client";

import ProfilePage from "@/components/common/Profile";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Container from "@/components/common/Container";

export default function Cabinet() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <Container>
      <div className="flex-grow px-6 py-8">
        <ProfilePage />
      </div>
      </Container>
      <Footer />
    </div>
  );
}
