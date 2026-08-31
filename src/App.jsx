import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Menu from "./pages/Menu";
import DishDetail from "./pages/DishDetail";
import Experiences from "./pages/Experiences";
import ExperienceDetail from "./pages/ExperienceDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Gallery from "./pages/Gallery";
import Journal from "./pages/Journal";
import Article from "./pages/Article";
import Reservation from "./pages/Reservation";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const AdminProviders = lazy(() => import("./admin/AdminProviders"));
const AdminLogin = lazy(() => import("./admin/pages/Login"));
const AdminLayout = lazy(() => import("./admin/components/AdminLayout"));
const ProtectedRoute = lazy(() => import("./admin/components/ProtectedRoute"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminReservations = lazy(() => import("./admin/pages/Reservations"));
const AdminMessages = lazy(() => import("./admin/pages/Messages"));
const AdminMenu = lazy(() => import("./admin/pages/Menu"));
const AdminCategories = lazy(() => import("./admin/pages/Categories"));
const AdminExperiences = lazy(() => import("./admin/pages/Experiences"));
const AdminEvents = lazy(() => import("./admin/pages/Events"));
const AdminGallery = lazy(() => import("./admin/pages/Gallery"));
const AdminArticles = lazy(() => import("./admin/pages/Articles"));
const AdminTestimonials = lazy(() => import("./admin/pages/Testimonials"));
const AdminFaqs = lazy(() => import("./admin/pages/Faqs"));
const AdminSettings = lazy(() => import("./admin/pages/Settings"));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <span className="text-neutral-400 text-sm uppercase tracking-wide">Chargement...</span>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/notre-histoire" element={<Story />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:slug" element={<DishDetail />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/experiences/:slug" element={<ExperienceDetail />} />
        <Route path="/evenements" element={<Events />} />
        <Route path="/evenements/:slug" element={<EventDetail />} />
        <Route path="/galerie" element={<Gallery />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<Article />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminProviders />
          </Suspense>
        }
      >
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route index element={<Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense>} />
          <Route path="reservations" element={<Suspense fallback={<AdminFallback />}><AdminReservations /></Suspense>} />
          <Route path="messages" element={<Suspense fallback={<AdminFallback />}><AdminMessages /></Suspense>} />
          <Route path="menu" element={<Suspense fallback={<AdminFallback />}><AdminMenu /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<AdminFallback />}><AdminCategories /></Suspense>} />
          <Route path="experiences" element={<Suspense fallback={<AdminFallback />}><AdminExperiences /></Suspense>} />
          <Route path="events" element={<Suspense fallback={<AdminFallback />}><AdminEvents /></Suspense>} />
          <Route path="gallery" element={<Suspense fallback={<AdminFallback />}><AdminGallery /></Suspense>} />
          <Route path="articles" element={<Suspense fallback={<AdminFallback />}><AdminArticles /></Suspense>} />
          <Route path="testimonials" element={<Suspense fallback={<AdminFallback />}><AdminTestimonials /></Suspense>} />
          <Route path="faqs" element={<Suspense fallback={<AdminFallback />}><AdminFaqs /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<AdminFallback />}><AdminSettings /></Suspense>} />
          <Route path="*" element={<Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
