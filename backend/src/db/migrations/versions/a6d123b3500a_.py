"""empty message

Revision ID: a6d123b3500a
Revises: 5368960667aa
Create Date: 2025-03-04 20:30:27.201478

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'a6d123b3500a'
down_revision: Union[str, None] = '5368960667aa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('carts', sa.Column('id', sa.Integer(), nullable=False))
    op.drop_constraint('carts_user_id_fkey', 'carts', type_='foreignkey')
    op.create_foreign_key(None, 'carts', 'users', ['id'], ['id'])
    op.drop_column('carts', 'user_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('carts', sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'carts', type_='foreignkey')
    op.create_foreign_key('carts_user_id_fkey', 'carts', 'users', ['user_id'], ['id'])
    op.drop_column('carts', 'id')
    # ### end Alembic commands ###
