# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Admin Product Image Upload

- Admins can upload product images via the dashboard.
- The product form supports file upload and image preview.
- Images are uploaded to Firebase Storage via `/api/products/upload` (admin-only).
- The returned public URL is used as `imageSrc` for the product.
- The admin token must be present in localStorage as `idToken` for uploads to work.
