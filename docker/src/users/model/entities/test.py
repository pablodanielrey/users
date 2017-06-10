from users.model.entities import Base, User, Telephone

if __name__ == '__main__':
    import logging
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    engine = create_engine('postgresql://postgres:clavesecreta@localhost:5432/testing')
    Base.metadata.create_all(engine)

    Sm = sessionmaker(bind=engine)
    s = Sm()
    s.add_all([
        User(dni='27294557', name='Pablo Daniel', lastname='Rey', telephones=[Telephone(number='1212',type='cel')]),
        User(dni='27294558', name='Pablo Daniel1', lastname='Rey'),
        User(dni='27294559', name='Pablo Daniel2', lastname='Rey', telephones=[Telephone(number='122222222',type='cel'), Telephone(number='333332',type='cel')]),
        User(dni='27294550', name='Pablo Daniel3', lastname='Rey')
    ])
    s.commit()
    for t in s.query(User).all():
        print(t.__json__())
        for t2 in t.telephones:
            print(t2.__json__())


    for t in s.query(Telephone).all():
        print(t.__json__())
        print(t.user.__json__())


    #logging.info(Telephone.findAll(s))
