"use client";

import { useEffect, useMemo, useState } from "react";
import { oidcEarlyInit } from "oidc-spa/entrypoint";
import { oidcSpa } from "oidc-spa/react-spa";

const clientId = process.env.NEXT_PUBLIC_REMILIA_CLIENT_ID ?? "tpa-login-bot-rad";

if (typeof window !== "undefined") {
  oidcEarlyInit({ BASE_URL: "/" });
}

const { bootstrapOidc, useOidc, OidcInitializationGate, getOidc } = oidcSpa.createUtils();
let hasBootstrapped = false;

type RemiliaProfile = {
  id?: string;
  username?: string;
  email?: string;
  name?: string;
  displayName?: string;
  [key: string]: unknown;
};

function RemiliaAuthCard() {
  const oidc = useOidc();
  const [status, setStatus] = useState<string>("Checking session...");
  const [profile, setProfile] = useState<RemiliaProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!oidc.isUserLoggedIn) {
      setProfile(null);
      setProfileError(null);
      setStatus("Not signed in");
      return;
    }

    setStatus("Signed in with RemiliaNET");

    let cancelled = false;

    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);

      try {
        const oidcClient = await getOidc({ assert: "user logged in" });
        const accessToken = await oidcClient.getAccessToken();

        const res = await fetch("https://www.remilia.net/api/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Profile fetch failed: ${res.status}`);
        }

        const data = (await res.json()) as RemiliaProfile;

        if (!cancelled) {
          setProfile(data);
        }
      } catch (error) {
        if (!cancelled) {
          setProfile(null);
          setProfileError(error instanceof Error ? error.message : "Could not load profile");
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [oidc.isUserLoggedIn]);

  const buttonLabel = useMemo(() => {
    return oidc.isUserLoggedIn ? "Sign out" : "Sign in with RemiliaNET";
  }, [oidc.isUserLoggedIn]);

  return (
    <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-lg">
      <div className="card-body gap-4">
        <h2 className="card-title text-lg">Remilia Login</h2>
        <p className="text-sm text-base-content/70">{status}</p>

        {profileLoading && <p className="text-sm text-base-content/70">Loading user profile…</p>}

        {profile && (
          <div className="rounded-box bg-base-200 p-3 text-left text-sm">
            <p>
              <strong>ID:</strong> {profile.id ?? "unknown"}
            </p>
            <p>
              <strong>Name:</strong> {profile.name ?? profile.displayName ?? profile.username ?? "unknown"}
            </p>
            <p>
              <strong>Email:</strong> {profile.email ?? "not provided"}
            </p>
          </div>
        )}

        {profileError && <p className="text-sm text-error">{profileError}</p>}

        <button
          type="button"
          className={`btn ${oidc.isUserLoggedIn ? "btn-outline" : "btn-primary"}`}
          onClick={() => {
            if (oidc.isUserLoggedIn) {
              void oidc.logout({ redirectTo: "home" });
              return;
            }

            void oidc.login();
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export function RemiliaLogin() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (hasBootstrapped) {
      return;
    }

    hasBootstrapped = true;

    void bootstrapOidc({
      BASE_URL: "/",
      implementation: "real",
      issuerUri: "https://www.remilia.net/oidc/realms/remilia",
      clientId,
    });
  }, []);

  return (
    <OidcInitializationGate fallback={<div className="text-sm text-base-content/70">Loading Remilia session…</div>}>
      <RemiliaAuthCard />
    </OidcInitializationGate>
  );
}

export function RemiliaProtectedSection() {
  return (
    <OidcInitializationGate fallback={<div className="text-sm text-base-content/70">Loading Remilia session…</div>}>
      <RemiliaAuthCard />
    </OidcInitializationGate>
  );
}
