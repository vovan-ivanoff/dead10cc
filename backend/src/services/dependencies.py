from fastapi import Depends, Request, HTTPException, Response



def get_page(request: Request, response: Response) -> int:
    page = request.cookies.get("SnaplyPaging")
    if not page:
        response.set_cookie(
            key="SnaplyPaging",
            value="0",
        )
        return 0

    return int(page)


def increase_page(response: Response, page: int = Depends(get_page)):
    response.set_cookie(
        key="SnaplyPaging",
        value=str(page + 1),
    )
    return page