import Header from "components/Header";
import Footer from "components/Footer";

const Layout = ({ children }) => {
  return (
    <main className="flex flex-col h-screen justify-between font-sans bg-white">
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default Layout;
