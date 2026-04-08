import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const modifiedReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })

    return next(modifiedReq);
}